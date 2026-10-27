# REV Community Schoolyard — v0.2 First Test Pilot

**Branch**: `feature/ue5-drift-academy-v0`  
**Draft PR**: https://github.com/pmoritz53678-del/rev-community-drift-game-/pull/1  
**Status**: Browser code, original procedural car parts, and driver AI are implemented; only the web build pipeline can be considered independently validated when its green GitHub Actions run is visible. Unreal Engine native build is NOT verified or packaged. No public GitHub Pages URL has been authorized.

## Fastest pilot on a computer

1. Open the pull request and read the GitHub Actions **Schoolyard Web Checks** result. Green means the CI has executed Node unit tests, Vite build, and headless Chromium navigation tests, not that every real phone/GPU has been tested.
2. At the green run, download the **rev-schoolyard-e2e** artifact for garage, track and Grip mode screenshots. Download **rev-schoolyard-web** for the static web build.
3. To edit and play from source:

```bash
git clone https://github.com/pmoritz53678-del/rev-community-drift-game-.git
cd rev-community-drift-game-
git checkout feature/ue5-drift-academy-v0
cd web
npm install
npm test
npm run build
npm run test:e2e
npm run dev
```

4. Open the URL printed by Vite (usually `http://localhost:5173`). Use Chrome/Edge/Safari on a capable computer.

If you downloaded the compiled `rev-schoolyard-web` artifact instead, unzip into a folder and serve it over HTTP with a static web server; opening `index.html` as `file://` can block ES modules.

## What to play

1. **Parker's Garage** opens first, featuring an original rotating fictional coupe.
2. **ENTER DRIFT MODE** goes to D1 North Pines Tandem. W/Up throttle; A/D steer; S/Down brake; Space handbrake; C camera; R reset; M switch Drift/Grip handling; G world map. Touch controls are available.
3. Select **GARAGE**, select a fictional Japanese-style car, choose **Widebody Competition**, **Mesh Motorsport** wheels and **GT Wing**, and change paint. The car's 3D parts should change. Choose another car then return; builds should persist in this browser.
4. In DRIVE, choose **AI TANDEM PRACTICE > LEAD**. Drive behind the AI. You can also try **CHASE** for the AI to follow your path. AI path following and drift steering are experimental; the AI is not multiplayer.
5. Use **WORLD** to select all five courses: D1 North Pines Tandem, D2 East Bowl, D3 South Switchbacks, R1 Schoolyard GP, R2 Outer Express. Two modes: Drift and high-grip Race.
6. On Outer Express the AI traffic is simulated on a fictional circuit. Race lap checks and pass scoring are experimental. This is not a replica of real public road traffic.
7. In WORLD select a Schoolhouse department, park below 5 km/h near the entrance and press **E** or tap the prompt to open the department UI.
8. Return to Parker's Garage using the **BACK TO GARAGE** control.

## What has been implemented and what is still missing

| Capability | Pilot | Production requirement |
|---|---|---|
| Three drifting circuits and two racing circuits | Procedural spline roads | Custom collision barriers, finished scenery, curb geometry |
| Fictional 15-car roster | Simple original procedural meshes | Custom textured/licensed rigged models |
| 3 body kits, 4 rims, 3 wings | Visual meshes and basic handling modifiers | Real deformation, LODs, proper collision/rigging |
| Garage persistence | Local browser saved builds | Save versioning and optional synced account |
| AI tandem lead/chase | Track sensing + basic steering over player physics | Predictive drift dynamics, collision avoidance, better player following |
| Live world map | Canvas based on in-game coordinates | 3D in-engine map, navigation waypoints |
| Schoolhouse departments | Outdoor blocks and entry modals | Designed interactive department interiors and NPCs |
| Unreal 5.8 | C++ project/spline CSV scaffold | Compile, create .umap, Chaos Vehicles, tune, device package |
| Mobile | Responsive touch prototype | Tested frame rate, joystick refinement, hardware/performance QA |
| Community multiplayer | Not available | Separate dedicated network/backend phase |

## License boundaries

The actual IceMaan and Cosmo meshes are **not** part of this pilot. Current car parts are authored procedurally in this repository. The external candidates, CC0/free-vs-premium distinction, and import checklist are documented in `docs/REUSE-ASSETS.md` and `docs/ASSET-LEDGER.csv`. No copied GTA, Roblox, Torque Drift or real manufacturer assets are used.

## Codex handoff

```text
Open pmoritz53678-del/rev-community-drift-game-, branch feature/ue5-drift-academy-v0.
Read AGENTS.md, docs/SCHOOLYARD-TRACKS.md, docs/REUSE-ASSETS.md,
docs/PILOT-v0.2.md and reports/BUILD-REPORT.md.
Run npm test, npm run build and npm run test:e2e inside web/.
Review screenshots, fix any regressions, then play on actual desktop/phone.
Check all five courses, 3 JDM body kits, 4 rims, 3 wings, saved builds,
AI tandem LEAD/CHASE, cockpit/third-person camera, Grip switching,
racing laps, and parked department entry. Report actual test evidence.
Next, convert the five track CSV splines into an authored Unreal Schoolyard
map using Chaos Vehicles and properly licensed/rigged car meshes.
Do not edit the private You vs AI finance repository; keep its Saturday
car meet social only. Open a PR; no automatic storefront publication.
```
