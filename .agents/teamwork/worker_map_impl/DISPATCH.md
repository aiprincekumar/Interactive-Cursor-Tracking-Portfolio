## 2026-10-18T19:35:16Z
[Message] timestamp=2026-10-18T19:35:16Z sender=493ffeb4-a36d-4f1e-8e19-9de6bdac340c priority=MESSAGE_PRIORITY_HIGH content=You are the Worker implementing the preloading cached offline map refinement (Milestone 7).
Your assigned working directory is: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_map_impl\`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read:
1. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (specifically timestamp 2026-10-18T19:01:39Z)
2. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_7\SCOPE.md`
3. Explorer handoffs:
   - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_map_ui\handoff.md`
   - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_map_tiles\handoff.md`
   - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_map_tests\handoff.md`

File Write Ownership:
You have exclusive write ownership of:
- `scripts/download_osm_tiles.mjs`
- `scripts/verify_offline_tiles.mjs`
- `scripts/verify_leaflet_map.mjs`
- `src/components/LeafletOfflineMap.jsx`
- `src/components/OfflineMapSnapshot.jsx`
- `changes_log/`
- `public/assets/tiles/`

Implementation Requirements:
1. Step 1: Update `scripts/download_osm_tiles.mjs` to support 7x5 wide grid for zooms 12 & 13 (dx: -3..3, dy: -2..2) and 3x3 for zooms 14 & 15. Total tiles = 88. Run `node scripts/download_osm_tiles.mjs` to fetch all 52 new tiles with proper tEXt padding >5KB.
2. Step 2: Update `src/components/LeafletOfflineMap.jsx`:
   - Completely remove `pulsingIcon`, `L.marker`, `marker.bindPopup`, `.leaflet-pulsing-marker-wrapper`, and `.custom-leaflet-popup`.
   - Add `maxBounds: [[23.8054, 83.7598], [24.2069, 84.3750]]` and `maxBoundsViscosity: 1.0` to `L.map` options.
   - Add `bounds: [[23.8054, 83.7598], [24.2069, 84.3750]]` to `L.tileLayer` options.
3. Step 3: Update `src/components/OfflineMapSnapshot.jsx`:
   - Remove landmark overlay pinpoint markers and popovers from map canvas.
   - Remove `animate-pulse` from HUD header icon and `animate-ping` from indicator dot.
   - Retain `LANDMARKS` metadata constant in the file so `verify_map_hybrid_system.mjs` passes.
4. Step 4: Update `scripts/verify_offline_tiles.mjs`:
   - Set 7x5 expected ranges for zooms 12 & 13, and expect all 88 tiles to pass verification.
5. Step 5: Update `scripts/verify_leaflet_map.mjs`:
   - Update expected tile count assertion to 88.
   - Invert marker pin assertions: assert absence of `L.marker`, `bindPopup`, `leaflet-pulsing-marker-wrapper`, and `animate-ping`.
   - Assert presence of `maxBounds` and `maxBoundsViscosity: 1.0` (or `maxBoundsViscosity: 1`).
6. Step 6: Verification commands:
   - Run `node scripts/verify_offline_tiles.mjs`
   - Run `node scripts/verify_leaflet_map.mjs`
   - Run `node scripts/verify_map_hybrid_system.mjs`
   - Run `npm test`
   - Run `npm run lint`
   - Run `npm run build`
   All must pass with 0 errors!
7. Step 7: Record changes log under `CHG-MAP-005` in `changes_log/` following Universal Rule 6 and Rule 8:
   - Create entry `changes_log/entries/2026-10-18/change_CHG-MAP-005_2026-10-18_19-35-00.md` (or current timestamp).
   - Update `changes_log/summary/changes_summary.md`.
   - Update `changes_log/master/master_changes_log.md`.
   - Update `changes_log/daily/2026-10-18/daily_master_log.md`.
   - Update `changes_log/recent_10/` (shift 1..9 to 2..10, put CHG-MAP-005 in `change_recent_01.md`).
