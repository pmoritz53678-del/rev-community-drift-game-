# Ready-to-run Codex assignment

Open **https://github.com/pmoritz53678-del/rev-community-drift-game-** and select branch `feature/ue5-drift-academy-v0`. Keep the other private Schoolhouse finance repo unchanged.

## Mission 1 — Prove the playable browser prototype

- Read `AGENTS.md`, `docs/SCHOOLYARD-TRACKS.md`, `docs/REUSE-ASSETS.md` and `reports/BUILD-REPORT.md`.
- Run: `cd web && npm install && npm test && npm run build && npm run dev`.
- Manually play with keyboard and touch, confirm garage start, 15 car selector, exactly 3 drift circuits and 2 race circuits, `M` handling change, moving game minimap, AI traffic on Outer Express, lap crossing, no score off drift track, and park-to-enter department.
- Repair any failures and add automated reproducible tests; only mark tests "pass" when verified. Capture browser screenshots/videos and measured desktop/mobile performance.
- Add physical course boundaries and reliable reset; improve map labeling and visual polish.

## Mission 2 — Bring the same Schoolyard into Unreal Engine 5.8

- Download/install Unreal from https://www.unrealengine.com/download .
- Use Epic's Vehicle Template (Timetrial variant) as a legally sourced starting point for Chaos driving and UI.
- Generate 5 course CSVs via `node tools/export_unreal_tracks.mjs`.
- Open `REVDrift.uproject`, build C++ with the supported toolchain. Compile and test `UREVSchoolyardSplineLibrary::LoadSchoolyardTrack`, imported width and closed splines in a new map.
- For each track create an Unreal spline road Blueprint with collision, runoffs, barriers, race checkpoint sequence and large drift clipping curves. The current CSV generates spline points, **not finished road meshes**.
- Build a true Parker's Garage starting menu and one consistent 3D campus, with shops at the authored coordinates and user navigation.
- Make DriveMode a data asset: DRIFT=high steering lock, controlled oversteer; GRIP=stability/high traction; keep one car and track between mode changes. Benchmark frame rate.
- Import a vetted CC0 asset pack with provenance and license verification; original hero car designs still need unique modeled bodies and rigs.

## Mission 3 — Verify / release safely

- Update `reports/BUILD-REPORT.md` with exact versions, warnings, hardware, test evidence and remaining blockers.
- Separate code review for Unreal and for website changes. Do not claim console/App Store readiness before certification/device QA.
- Keep Saturday Schoolhouse social car meet non-racing and no financial-data integration.
- Submit PR; **don't merge or publish without owner approval**.

## Fast QA checklist

[ ] `npm test` passes
[ ] `npm run build` passes
[ ] 3 drift + 2 race selection works
[ ] lap gate works, offtrack invalidates
[ ] mode switch actually changes car motion
[ ] 3D camera and car visible
[ ] player moves on live minimap
[ ] collision/proximity scoring cooldown works
[ ] shop E interaction requires parking
[ ] mobile controls don't overlap vital HUD
[ ] native UE build and spline import proved separately
[ ] no unlicensed code/assets and no financial ledger connections

**Definition of done:** a playable browser game and a separately verified Unreal Editor prototype—not just source files.
