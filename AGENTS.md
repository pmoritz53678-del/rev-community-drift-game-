# AGENTS — Codex instructions for REV Schoolyard Motorsports

**Read first:** `README.md`, `docs/SCHOOLYARD-TRACKS.md`, `docs/REUSE-ASSETS.md`, `docs/CODEX-SCHOOLYARD-TASK.md`, `docs/REPO-RULES.md`.

## Strict product boundaries
1. One connected Schoolyard campus **only**, with exactly five closed courses: 3 wide-corner drift/tandem and 2 race. No separate city, real street routes or third-party map rips.
2. Keep Parker's Garage as the first menu; Enter Drift/Grip launches into the same world and same car. Toggle `M` changes physics profile without swapping the whole game.
3. Eight Schoolhouse departments are outdoor shop fronts; the E interaction requires parking. Their modals are informational until an approved data integration is scoped.
4. Never access or mutate `you-vs-ai--the-game-` investment ledgers, trading rules, agents or user financial data. No cross-project private API. Saturday Car Meet stays social / no racing.
5. Maintain original fictional hero manufacturers and distinct silhouettes. No GTA/No Hesi/Roblox assets, ripped tracks, paid plugins or automaker badges without proper rights.
6. If adding CC0/MIT content, confirm each item and record its source/license/version in `docs/ASSET-LEDGER.csv`. Keep MIT notices if copying MIT source code. Do not copy engine sources.
7. Work on feature branches; request PR approval, do not merge/deploy without owner review.
8. Do not call a source file a working iOS/Unreal game until it was compiled and executed. Report evidence and exact unsolved errors.

## Browser QA (Node 22 recommended)
```bash
cd web
npm install
npm test
npm run build
npm run dev
```
Smoke test actual desktop/mobile rendering and controls, track selection, five-course layout, valid lap gating, 3 drift tracks and no score at social meet, two physics modes, campus map dot, AI traffic on Outer Express, and park-to-enter.
Do not use stale commands for the removed `play/` prototype.

## Unreal QA
```bash
node tools/export_unreal_tracks.mjs
```
Install UE 5.8, open `REVDrift.uproject`, compile module, import five CSV splines, generate actual road geometry/collision in Unreal and integrate the Epic Vehicle Template or original Chaos pawn. **No native build has been verified yet.**

## Definition of done
A repeatable browser build, on-device input/graphics test, documented Unreal Editor compilation, test evidence and a verified content rights ledger. Never silently merge prototype functionality that breaks gameplay.