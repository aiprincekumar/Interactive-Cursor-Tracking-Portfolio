# Plan: Preloading Cached Offline Map Refinement

## Objective
Refine the preloading cached offline map:
1. R1: Remove marker pin, pulsing radar dot, and popup tooltips from `LeafletOfflineMap.jsx` and `OfflineMapSnapshot.jsx`.
2. R2: Expand pre-cached raster tile coverage for Medininagar (24.0416, 84.0700) using a wide 7x5 tile grid across zooms 12 & 13 (and retain supporting zoom 14/15 center tiles).
3. R3: Configure Leaflet `maxBounds` and `maxBoundsViscosity: 1.0` locked precisely to the cached tile coordinates.
4. R4: Update download and verification test scripts, verify all acceptance criteria (npm test, npm run lint, npm run build pass with 0 errors), and record Rule 6 changes log under `CHG-MAP-005`.

## Phase 1: Investigation & Survey (Explorers)
- Dispatch 3 Explorers in parallel:
  - **Explorer 1 (UI & Map Component Specialist)**: Inspect `src/components/LeafletOfflineMap.jsx` and `src/components/OfflineMapSnapshot.jsx`, locating all pins, marker icons, pulsing radar dots, popups, and current maxBounds/viscosity settings.
  - **Explorer 2 (Tile Grid & Geometry Specialist)**: Inspect tile download scripts (`scripts/download_osm_tiles.mjs`), directory layout (`public/tiles/`), bounding box / tile coordinate math for 7x5 grid at zoom 12 and 13 around (24.0416, 84.0700), and zoom 14/15 center tiles.
  - **Explorer 3 (Verification & Test Suite Specialist)**: Inspect verification scripts (`scripts/verify_offline_tiles.mjs`, `scripts/verify_leaflet_map.mjs`, `scripts/verify_map_hybrid_system.mjs`), test files (`tests/` or vitest suites), lint and build scripts, and previous changes log entries (`CHG-MAP-001` through `CHG-MAP-004`).

## Phase 2: Implementation (Worker)
- Dispatch Worker to:
  1. Update `scripts/download_osm_tiles.mjs` to download the 7x5 grid for z12 & z13 (35 tiles each = 70 tiles) plus zoom 14/15 center tiles. Run the download script to ensure all tiles are fetched into `public/tiles/`.
  2. Modify `src/components/LeafletOfflineMap.jsx` and `src/components/OfflineMapSnapshot.jsx` to completely eliminate markers, pulsing dots, and tooltips.
  3. Compute and apply strict `maxBounds` and `maxBoundsViscosity: 1.0` based on the exact 7x5 tile bounds.
  4. Update `scripts/verify_offline_tiles.mjs`, `scripts/verify_leaflet_map.mjs`, and `scripts/verify_map_hybrid_system.mjs`.
  5. Run all verifications: `node scripts/verify_offline_tiles.mjs`, `node scripts/verify_leaflet_map.mjs`, `npm test`, `npm run lint`, and `npm run build`.
  6. Document changes in `changes_log/` under `CHG-MAP-005` adhering to Rule 6 and Rule 8.

## Phase 3: Review, Adversarial Challenge & Forensic Audit
- Dispatch 2 Reviewers independently to verify code quality, requirements fulfillment, and UI cleanly rendering without pins.
- Dispatch 2 Challengers to test edge panning, zoom levels, ultra-wide viewport handling (up to 1920px), and offline tile fallback.
- Dispatch 1 Forensic Auditor (`teamwork_preview_auditor`) for integrity verification.

## Phase 4: Gate Synthesis & Completion
- Collect all reports in `GATE_STATUS.md`.
- Ensure all criteria pass (strict AND).
- Send comprehensive final report back to Sentinel caller.
