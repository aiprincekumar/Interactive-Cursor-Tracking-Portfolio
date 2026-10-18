# Scope: Preloading Cached Offline Map Refinement

## Architecture
- Cartography frontend components: `src/components/LeafletOfflineMap.jsx`, `src/components/OfflineMapSnapshot.jsx`, and `src/components/ContactSection.jsx`.
- Local raster tile cache: `public/assets/tiles/{z}/{x}/{y}.png`.
- Scripts & tools: `scripts/download_osm_tiles.mjs`, `scripts/verify_offline_tiles.mjs`, `scripts/verify_leaflet_map.mjs`, `scripts/verify_map_hybrid_system.mjs`.
- Audit & logging: `changes_log/` under change ID `CHG-MAP-005`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1: Marker & Popup Removal | Remove pin, pulsing radar dot, tooltips from LeafletOfflineMap & OfflineMapSnapshot | M1 | ORIGINAL_REQUEST.md |
| 2 | R2: 7x5 Tile Grid Expansion | Pre-cache 7x5 tile grid for z12 & z13 around Medininagar (24.0416, 84.0700) + retain z14/z15 center | M1 | ORIGINAL_REQUEST.md |
| 3 | R3: maxBounds Panning Lock | Configure Leaflet maxBounds & maxBoundsViscosity 1.0 locked to tile coordinates | M1 | ORIGINAL_REQUEST.md |
| 4 | R4: Automated Tests & Rule 6 Log | Update scripts, pass npm test/lint/build, log CHG-MAP-005 | M1 | ORIGINAL_REQUEST.md |

## Milestones
| # | Name | Scope | Dependencies | Status | Key Outputs |
|---|------|-------|-------------|--------|-------------|
| 1 | Offline Map Refinement | R1, R2, R3, R4 | none | DONE | 88 pre-cached tiles (>5KB each), LeafletOfflineMap.jsx with maxBoundsViscosity: 1.0 and zero markers/popups, OfflineMapSnapshot.jsx, verify scripts updated, npm test 12/12 passed, 0 lint errors, build succeeded, CHG-MAP-005 recorded |
