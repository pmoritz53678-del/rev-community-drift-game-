# REV Community — Schoolyard Motorsports

**One fictional Schoolyard campus. Three tandem drift tracks. Two race tracks. Fifteen original concept cars.**

This independent project adapts the *automotive world idea* associated with You vs AI, not its financial data or investment competition. Schoolhouse shops are approachable department doorways; the Saturday community meet is strictly social and has no racing.

## Current build status (Oct 27, 2026)

- **Browser 3D prototype source is implemented**, with a starting garage, camera, garage selection, Drift/Grip modes, 3 authored drift and 2 race tracks, 8 department entrances, AI road traffic on the closed Outer Express, live game-coordinate minimap, scoring and lap sectors.
- Source-level JavaScript syntax and core behavior checks have been performed. **A real Vite build / browser device play test has NOT yet been completed in this session.** Do not claim a polished finished game.
- `REVDrift.uproject` and the Unreal 5.8 spline import C++ module are **a scaffold, not a compiled UE project or .umap**. Codex/Unreal Editor must verify it.

## Play and develop the web prototype

```bash
git clone https://github.com/pmoritz53678-del/rev-community-drift-game-.git
cd rev-community-drift-game-
git checkout feature/ue5-drift-academy-v0
cd web
npm install
npm test
npm run dev
```

Open the **local Vite URL shown in the terminal** (often `http://localhost:5173`). Do not double-click `web/index.html`; its module imports require the Vite development server or a built deployment.

**Controls:** W/Up accelerate · S/Down brake · A/D steer · Space handbrake · M change Drift/Grip handling · G map · C camera · R reset · E park-to-enter department. Touch controls are in the viewport. Track selection appears at the top and under World.

## Five courses

| Drift (wide tandem corners) | Race (grip handling) |
|---|---|
| D1 North Pines Tandem | R1 Schoolyard Grand Prix |
| D2 East Bowl | R2 Outer Express |
| D3 South Switchbacks | |

Drift and Race physics are **arcade approximations**, not verified real vehicle dynamics. Drift points are only awarded on drift courses. Race tracks use checkpointed laps. Outer Express has scripted AI car traffic and a clean-proximity scoring experiment; there are no real drivers/network sessions.

## Project structure

- `web/index.html` / `web/src/main.js` / `web/src/style.css`: Parker's Garage menu, gameplay and UI.
- `web/src/tracks.js` / `web/src/renderSchoolyard.js`: five original course layouts and generated 3D scenery.
- `web/src/world.js`: eight park-to-enter departments, garage and social meet rules.
- `web/src/physics.js` / `web/src/circuitTraffic.js`: drift/grip handling and script-controlled AI traffic.
- `web/src/mapUI.js`: live local minimap and full overview.
- `web/src/roster.js` and `data/vehicles.json`: synchronized 15 original fictional vehicles; placeholder geometry (not replicas).
- `web/tests/`: Node test suite; `web/package.json` includes build/test scripts.
- `REVDrift.uproject` / `Source/` / `Config/`: Unreal project skeleton and track-spline CSV reader (native compile pending).
- `tools/export_unreal_tracks.mjs`: same five circuits exported into UE centimeters and spline rows.
- `docs/SCHOOLYARD-TRACKS.md`: design decisions, world map and acceptance criteria.
- `docs/REUSE-ASSETS.md` and `docs/ASSET-LEDGER.csv`: Kenney/Quaternius/Epic and open-source reuse with license provenance.
- `docs/CODEX-SCHOOLYARD-TASK.md`: ready-to-run Codex brief and QA gates.
- `reports/BUILD-REPORT.md`: evidence and untested work.

## Unreal migration

Install Unreal from https://www.unrealengine.com/download then read [Unreal setup](docs/UNREAL-SETUP.md). Run `node tools/export_unreal_tracks.mjs` at repository root and use the project spline importer or the Epic Vehicle Template Timetrial variant for a legal Chaos Vehicles starting point. This workflow does **not** auto-convert Three.js into Unreal and does **not** contain finished vehicle rigs.

## Project rules

Only original hero car shapes and fictional brands. CC0 and MIT assets are **candidates until actually downloaded and logged**, not already imported. This public repo never reads private Schoolhouse investment data or logs, never executes real trades, and never offers real-world street racing. See [AGENTS](AGENTS.md), [repository rules](docs/REPO-RULES.md) and [rights](docs/ASSET-IP-LICENSING.md).

**Brand spirit:** *Driven by cars. Connected by community.*