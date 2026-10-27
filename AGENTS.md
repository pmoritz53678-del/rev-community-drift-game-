# AGENTS.md — Codex instructions for REV Drift

## Mission
Create an original, fun, mobile-ready drifting game within this repository. Focus on driving feel before graphical polish.

## Hard boundaries
1. Work only inside this repository. Do **not** read from, push to or edit the `you-vs-ai--the-game-` repository, investment ledgers, real money data, agent state or RTE College Aid files.
2. No real-world racing missions; Saturday public car meets are social and no racing/timed runs. Drift challenges happen on fictional closed courses.
3. Do not copy third-party meshes, trademarks, licensed textures, proprietary sound, source code, game's HUD, ripped assets, or engine source into this public repo. Fictional brands and cars must be **visually original**, not identical replicas with renamed badges.
4. The proprietary Unreal Engine itself is installed by the developer through Epic; this repo stores only the project's original `Source/`, `Config/`, game assets, and documentation.
5. Each change includes a test or manual reproducible check; do not label C++ code "compiles" until validated inside the Unreal Editor or official build tools.
6. Preserve a functional browser demo when making changes; test `node --check play/game.js`, `python3 -m unittest discover -s tests -v`, and a manual keyboard/touch smoke test.
7. Introduce mobile controls, garage saves, battle mode and network features as distinct pull requests. No hidden payments, telemetry, or external services.
8. Prefer original low-poly geometry for prototype; separate render meshes from physics chassis and make vehicle stats data driven.
9. Read `docs/REPO-RULES.md`, `docs/ASSET-IP-LICENSING.md`, and `docs/UNREAL-SETUP.md` before edits. Keep README and file index current.
10. Work on a feature branch, request review, and clearly list limitations. Do not publish to storefront or merge without Director approval.

## Definition of done for Phase 0
- Browser test is controllable with WASD / arrows and Space, car can drift, score rises under a sustained drift, reset works, vehicle switch works, no external APIs.
- Vehicle catalog passes schema/unit checks and each ID is unique.
- Unreal project builds on a machine with the specified engine, a level loads, the placeholder pawn can accelerate/steer/drift, and HUD reflects score.
- Car art remains recognizably *inspired by a class* but substantially original.
- All platform claims and licenses checked before publication.

## First Codex objective
Follow `docs/CODEX-HANDOFF.md`: get a **native Unreal 5.8 build and play-in-editor test**, fix API/build issues, import one original vehicle OBJ, then implement Chaos Vehicles on a separate branch.
