# DISPATCH: Orchestrator 7

## Mission
Refine the preloading cached offline map: completely remove the location pointer pin and popup tooltip, expand offline tile coverage to a wide 7x5 grid across zooms 12 & 13 matching Google Maps's screen-filling view without grey borders on screens up to 1920px, and enforce strict maxBounds locking.

## Authority & Identity
- Type: `teamwork_preview_orchestrator`
- Agent Directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_7`
- Project Root: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
- Original Request: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (Timestamp: 2026-10-18T19:01:39Z)

## Requirements Summary

### R1. Complete Removal of Pointer Pin & Popups
Completely remove the marker pin, pulsing radar dot, and popup tooltips from `src/components/LeafletOfflineMap.jsx` and `src/components/OfflineMapSnapshot.jsx`. The cached map view must present a clean, uninterrupted cartographic map overview with zero pinpoint indicators.

### R2. Wide Full-Area Tile Coverage Matching Google Maps
Expand the pre-cached raster tile coverage for Medininagar (Lat 24.0416, Lng 84.0700) using a wide 7x5 tile grid (7 tiles wide horizontally, 5 tiles high vertically) for zooms 12 and 13 (and retain supporting zoom 14/15 center tiles). This ensures that on ultra-wide desktop monitors (up to 1920px) and mobile devices alike, the offline map seamlessly covers the full visible canvas with no clipped edges or empty grey blocks.

### R3. Strict maxBounds Panning Lock
Configure Leaflet `maxBounds` and `maxBoundsViscosity: 1.0` locked precisely to the cached tile coordinates. When the user interacts with or drags the offline map, it smoothly resists and prevents panning beyond the cached geography, preventing any exposure of grey or missing tiles.

### R4. Automated Verification & Rule Compliance
Update download and verification test scripts (`download_osm_tiles.mjs`, `verify_offline_tiles.mjs`, `verify_leaflet_map.mjs`, `verify_map_hybrid_system.mjs`) to validate the expanded tile grid, pointer absence, and maxBounds configuration. Ensure `npm test`, `npm run lint`, and `npm run build` pass with zero errors, and log all changes in `changes_log/` following Rule 6 (under change ID `CHG-MAP-005`).

## Acceptance Criteria
- [ ] No marker pin, pulsing dot, or popup is visible anywhere on the offline map.
- [ ] On desktop screens up to 1920px wide, the offline map renders completely filled from edge to edge with valid cartography tiles and zero blank/grey margins.
- [ ] Dragging/panning the map is constrained within the cached bounds (`maxBoundsViscosity: 1.0`), preventing the user from dragging out into unrendered areas.
- [ ] Live Google Maps iframe remains 100% untouched and functional.
- [ ] All downloaded tiles are verified (>5KB, valid PNG magic bytes, 256x256 decode).
- [ ] `node scripts/verify_offline_tiles.mjs` and `node scripts/verify_leaflet_map.mjs` exit code 0.
- [ ] `npm test` passes 100% of test suites.
- [ ] `npm run lint` (`oxlint`) reports 0 errors.
- [ ] `npm run build` completes production build with 0 errors.
- [ ] Rule 6 changes log recorded under a new change ID (`CHG-MAP-005`).


## 2026-10-18T19:06:41Z
Received dispatch from Sentinel parent (2757072b-1a87-42e6-b118-b0b338294d96):
Refining the preloading cached offline map:
- R1: Completely remove marker pin, pulsing radar dot, and popup tooltips from LeafletOfflineMap.jsx and OfflineMapSnapshot.jsx.
- R2: Expand pre-cached raster tile coverage for Medininagar (Lat 24.0416, Lng 84.0700) using a wide 7x5 tile grid across zooms 12 & 13 (and retain supporting zoom 14/15 center tiles).
- R3: Configure Leaflet maxBounds and maxBoundsViscosity: 1.0 locked to the cached tile coordinates.
- R4: Update download and verification test scripts, verify all acceptance criteria, ensure npm test, npm run lint, and npm run build pass with 0 errors, and record Rule 6 changes log under CHG-MAP-005.
