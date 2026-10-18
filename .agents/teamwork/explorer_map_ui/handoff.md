# Handoff Report: UI Map Explorer (LeafletOfflineMap, OfflineMapSnapshot, Bounds & Markers)

## Summary
Complete investigation of `LeafletOfflineMap.jsx`, `OfflineMapSnapshot.jsx`, and `ContactSection.jsx` has identified all marker pin icons, pulsing radar dots, popups/tooltips, and map bounds configurations. Exact line numbers, code snippets, proposed replacements, and test script impacts have been documented to guide Worker implementation under Milestone 7.

---

## 1. Observation

### 1.1 `src/components/LeafletOfflineMap.jsx`
- **Pulsing Marker Pin & Custom divIcon** (Lines 52–68):
  ```javascript
  52:     // Custom pulsing marker pin HTML icon
  53:     const pulsingIcon = L.divIcon({
  54:       className: 'leaflet-pulsing-marker-wrapper',
  55:       html: `
  56:         <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
  57:           <span class="absolute inline-flex h-8 w-8 rounded-full bg-[#FF4D6D] opacity-40 animate-ping"></span>
  58:           <span class="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF4D6D] text-white shadow-lg border-2 border-white dark:border-stone-900">
  59:             <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
  60:               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  61:             </svg>
  62:           </span>
  63:         </div>
  64:       `,
  65:       iconSize: [32, 32],
  66:       iconAnchor: [16, 16],
  67:       popupAnchor: [0, -18]
  68:     });
  ```
- **Marker Creation & Popup Tooltip** (Lines 70–87):
  ```javascript
  70:     // Create marker with popup
  71:     const marker = L.marker(MEDININAGAR_COORDS, {
  72:       icon: pulsingIcon,
  73:       title: 'Medininagar (Daltonganj), Jharkhand'
  74:     }).addTo(map);
  75: 
  76:     marker.bindPopup(
  77:       `<div class="font-sans text-xs">
  78:         <strong class="font-bold text-stone-900 dark:text-white">Medininagar (Daltonganj)</strong>
  79:         <span class="text-stone-400 dark:text-stone-500 mx-1">•</span>
  80:         <span class="text-stone-600 dark:text-stone-300">Jharkhand</span>
  81:       </div>`,
  82:       {
  83:         closeButton: false,
  84:         className: 'custom-leaflet-popup',
  85:         offset: [0, -12]
  86:       }
  87:     ).openPopup();
  ```
- **Marker & Popup CSS Styles** (Lines 129–150):
  ```css
  128:       <style>{`
  129:         .leaflet-pulsing-marker-wrapper {
  130:           background: transparent !important;
  131:           border: none !important;
  132:         }
  133:         .custom-leaflet-popup .leaflet-popup-content-wrapper {
  134:           background: rgba(255, 255, 255, 0.96);
  135:           border: 1px solid #E7E2D8;
  136:           border-radius: 12px;
  137:           box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  138:           padding: 2px 4px;
  139:         }
  140:         .dark .custom-leaflet-popup .leaflet-popup-content-wrapper {
  141:           background: rgba(24, 24, 27, 0.96);
  142:           border: 1px solid #3F3F46;
  143:           box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  144:         }
  145:         .custom-leaflet-popup .leaflet-popup-tip {
  146:           background: rgba(255, 255, 255, 0.96);
  147:         }
  148:         .dark .custom-leaflet-popup .leaflet-popup-tip {
  149:           background: rgba(24, 24, 27, 0.96);
  150:         }
  151:         .dark .leaflet-tile-pane {
  152:           filter: brightness(0.72) invert(1) contrast(2.6) hue-rotate(200deg) saturate(0.25);
  153:         }
  154:       `}</style>
  ```
- **Current Map Bounds & Options** (Lines 5, 8, 16, 32–39, 44–49):
  - Coordinates: `const MEDININAGAR_COORDS = [24.0416, 84.0700];` (Line 5).
  - Default zoom: `zoom = 13` (Line 8).
  - Zoom range: `minZoom: 12`, `maxZoom: 15`, `maxNativeZoom: 15` (Lines 35–36, 45–47).
  - `maxBounds`: **NOT CONFIGURED** (absent).
  - `maxBoundsViscosity`: **NOT CONFIGURED** (absent).
- **Imports in `LeafletOfflineMap.jsx`** (Lines 1–3):
  ```javascript
  1: import React, { useEffect, useRef } from 'react';
  2: import L from 'leaflet';
  3: import 'leaflet/dist/leaflet.css';
  ```
  Note: `react-leaflet` is NOT used; vanilla Leaflet `L` is used directly. No imports from external react-leaflet need removal, but `L.divIcon`, `L.marker`, and `bindPopup` method calls are removed from component body.

---

### 1.2 `src/components/OfflineMapSnapshot.jsx`
- **Map Canvas Pin Overlays & Popovers** (Lines 296–362):
  - The map canvas renders `{showTags && LANDMARKS.map((landmark) => ...)}`.
  - For each landmark, it renders a button with `Icon` (including `MapPin` for `center` at lines 20–30), pulsating ring on highlight, and a popover tooltip card when selected (lines 337–360).
- **HUD Header Bar Pulsing Pin & Dot** (Lines 198–215):
  - Line 200: `<MapPin className="w-4 h-4 animate-pulse" />`
  - Line 212: `<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />`
- **Fallback / Snapshot Rendering** (Lines 171–178, 283–295):
  - Selects raster map images `/assets/maps/medininagar-real-light.png` or `...dark.png` with `onError` fallback to `/assets/maps/medininagar-light.svg` or `...dark.svg`.
  - `LANDMARKS` metadata constant is defined at lines 17–79.
  - Important: `scripts/verify_map_hybrid_system.mjs` (lines 281–287) asserts:
    ```javascript
    const hasLocalData = (
      content.includes('LANDMARKS') ||
      content.includes('Medininagar') ||
      content.includes('Daltonganj')
    );
    assert.ok(hasLocalData, 'OfflineMapSnapshot must bundle local landmark / geographic metadata for instant offline fallback display');
    ```
    Therefore, the `LANDMARKS` data constant or geographic info must remain in the file even when canvas pinpoint overlays are eliminated.

---

### 1.3 `src/components/ContactSection.jsx`
- Imports `LeafletOfflineMap` at line 37: `import LeafletOfflineMap from './LeafletOfflineMap';`
- Renders `<LeafletOfflineMap zoom={zoom} onZoomChange={setZoom} className=... />` at lines 1282–1290.
- No direct markers or popups are rendered inside `ContactSection.jsx` on the map canvas. (Only header address card uses a section icon `MapPin` at line 1120).
- Zoom state is managed by `zoom` (state defaulted to 13, bounded between 12 and 15 for OSM).

---

### 1.4 Downstream Test Scripts (`scripts/verify_leaflet_map.mjs`)
- Lines 58–61:
  ```javascript
  assert.ok(
    leafletContent.includes('animate-ping') && leafletContent.includes('leaflet-pulsing-marker-wrapper'),
    'LeafletOfflineMap.jsx must implement the pulsing marker pin'
  );
  ```
- Lines 74–77:
  ```javascript
  assert.ok(
    leafletContent.includes('Medininagar (Daltonganj), Jharkhand'),
    'LeafletOfflineMap.jsx must feature clean city-level marker title'
  );
  ```
- Once marker and pulsing pin are removed per R1, `verify_leaflet_map.mjs` will fail until updated per R4.

---

## 2. Logic Chain

1. **Requirement R1 states**: "Completely remove the marker pin, pulsing radar dot, and popup tooltips from `src/components/LeafletOfflineMap.jsx` and `src/components/OfflineMapSnapshot.jsx`. The cached map view must present a clean, uninterrupted cartographic map overview with zero pinpoint indicators."
   - In `LeafletOfflineMap.jsx`, removing lines 52–87 (`pulsingIcon`, `marker`, `marker.bindPopup`) and lines 129–150 (CSS classes for marker and popup) completely eliminates the pointer pin, pulsing dot, and popup window.
   - In `OfflineMapSnapshot.jsx`, suppressing the interactive landmark overlay on the canvas and replacing the pulsing `MapPin` and pinging dot in the HUD header creates a clean, uninterrupted cartographic map overview with zero pinpoint indicators while keeping `LANDMARKS` data to satisfy `verify_map_hybrid_system.mjs`.

2. **Requirement R2 & R3 specify**: A 7x5 tile grid at zoom 12 and 13 covering Medininagar (`24.0416, 84.0700`), and `maxBounds` with `maxBoundsViscosity: 1.0` locked to the cached tile coordinates.
   - For Zoom 12: Center tile is `(cx: 3004, cy: 1766)`.
     A 7-wide by 5-high grid spans `x ∈ [3001, 3007]` (minX=3001, maxX=3007) and `y ∈ [1754, 1758]` (minY=1754, maxY=1758).
     Geographic coordinates derived from Slippy Map projection:
     - West longitude (`x=3001`): `(3001 / 4096) * 360 - 180 = 83.759765625° E` (~83.7598° E)
     - East longitude (`x=3008`): `(3008 / 4096) * 360 - 180 = 84.375° E` (~84.3750° E)
     - North latitude (`y=1754`): `24.2068896° N` (~24.2069° N)
     - South latitude (`y=1759`): `23.8054496° N` (~23.8054° N)
   - For Zoom 13: Center tile is `(cx: 6009, cy: 3532)`.
     A 7-wide by 5-high grid spans `x ∈ [6006, 6012]` and `y ∈ [3530, 3534]`.
     Geographic coordinates:
     - West longitude: `83.9355° E`
     - East longitude: `84.2432° E`
     - North latitude: `24.1267° N`
     - South latitude: `23.9260° N`
   - Therefore, setting `maxBounds: [[23.8054, 83.7598], [24.2069, 84.3750]]` and `maxBoundsViscosity: 1.0` in `L.map(...)` locks panning strictly within the outer cached tile boundary, preventing the user from panning into empty grey areas.

3. **Requirement R4 states**: Test scripts must be updated to validate the pointer absence, maxBounds configuration, and tile grid.
   - `scripts/verify_leaflet_map.mjs` must be updated to assert that `maxBounds` and `maxBoundsViscosity: 1.0` are present, and that marker/pulsing pin indicators are absent.

---

## 3. Caveats
- `OfflineMapSnapshot.jsx` contains `LANDMARKS` metadata tested by `scripts/verify_map_hybrid_system.mjs`. Do not delete the `LANDMARKS` array entirely; retain the constant so existing contract tests pass while removing or disabling the pinpoint display on the map canvas.
- Leaflet `maxBounds` works best when set on `L.map` options during initialization. Leaflet tileLayer also accepts `bounds: MEDININAGAR_BOUNDS`. Both can be supplied for defense in depth.

---

## 4. Conclusion & Worker Implementation Plan

### Step-by-Step Instructions for Worker:

#### Step 1: Update `src/components/LeafletOfflineMap.jsx`
1. Define the bounding box constant:
   ```javascript
   const MEDININAGAR_COORDS = [24.0416, 84.0700];
   const MEDININAGAR_BOUNDS = [
     [23.8054, 83.7598], // Southwest [lat, lng]
     [24.2069, 84.3750]  // Northeast [lat, lng]
   ];
   ```
2. Configure `maxBounds` and `maxBoundsViscosity: 1.0` on `L.map`:
   ```javascript
   const map = L.map(containerRef.current, {
     center: MEDININAGAR_COORDS,
     zoom: initialZoomRef.current,
     minZoom: 12,
     maxZoom: 15,
     maxBounds: MEDININAGAR_BOUNDS,
     maxBoundsViscosity: 1.0,
     zoomControl: false,
     attributionControl: true
   });
   ```
3. Set `bounds: MEDININAGAR_BOUNDS` on `L.tileLayer`:
   ```javascript
   const tileLayer = L.tileLayer(tileUrl, {
     minZoom: 12,
     maxZoom: 15,
     maxNativeZoom: 15,
     bounds: MEDININAGAR_BOUNDS,
     attribution: '&copy; OpenStreetMap contributors'
   });
   ```
4. Delete lines 52–87 (`pulsingIcon`, `L.marker`, `marker.bindPopup`).
5. Delete lines 129–150 in `<style>` (styles for `.leaflet-pulsing-marker-wrapper` and `.custom-leaflet-popup`), leaving only `.dark .leaflet-tile-pane`.

#### Step 2: Update `src/components/OfflineMapSnapshot.jsx`
1. Remove canvas landmark pinpoint overlays (lines 296–362) so the canvas displays an uninterrupted cartographic view.
2. In HUD header bar (lines 198–215):
   - Replace pulsing `MapPin` (`<MapPin className="w-4 h-4 animate-pulse" />`) with a static `Compass` or `Layers` icon without pulse animation.
   - Replace `<span className="... animate-ping" />` with a steady static dot indicator.
3. Clean up unused Lucide imports (`Train`, `Building2` if no longer referenced in JSX).

#### Step 3: Update `scripts/verify_leaflet_map.mjs`
1. Replace legacy pulsing marker assertions with:
   ```javascript
   assert.ok(
     !leafletContent.includes('animate-ping') && !leafletContent.includes('leaflet-pulsing-marker-wrapper'),
     'LeafletOfflineMap.jsx must NOT include pulsing marker pin'
   );
   assert.ok(
     !leafletContent.includes('L.marker') && !leafletContent.includes('.bindPopup'),
     'LeafletOfflineMap.jsx must NOT render pointer pin or popup tooltips'
   );
   assert.ok(
     leafletContent.includes('maxBounds') && leafletContent.includes('maxBoundsViscosity: 1.0'),
     'LeafletOfflineMap.jsx must configure maxBounds and maxBoundsViscosity: 1.0'
   );
   ```

---

## 5. Verification Method

To independently verify the investigation findings and resulting implementation:
1. Run syntax & lint verification:
   ```powershell
   npm run lint
   ```
   Must exit with 0 errors.
2. Run test verification:
   ```powershell
   node scripts/verify_leaflet_map.mjs
   node scripts/verify_map_hybrid_system.mjs
   npm test
   ```
   Must pass 100% of test suites.
3. Run production build:
   ```powershell
   npm run build
   ```
   Must complete with exit code 0.
