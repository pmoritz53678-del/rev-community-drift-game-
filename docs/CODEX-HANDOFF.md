# Codex handoff — take over Unreal build validation

## Objective
Build and play the independent REV Drift Academy starter project. The code is intentionally a first-pass arcade prototype and **has not been compiled here** (Unreal Editor is unavailable in the assistant environment). Keep it separate from the investment Schoolhouse.

## Open in Codex
Repository: https://github.com/pmoritz53678-del/rev-community-drift-game-
Feature branch: `feature/ue5-drift-academy-v0`
Engine: target Unreal Engine 5.8, use the version installed locally and record any migration.

## First tasks, in this order
1. Pull this branch; review `AGENTS.md` and `docs/REPO-RULES.md`.
2. Run `python3 -m unittest discover -s tests -v` and `node --check play/game.js`.
3. On a Windows development PC with UE5 installed, open `REVDrift.uproject`; regenerate IDE project files and compile using UnrealBuildTool/Visual Studio. Report exact API errors and fix in small PRs.
4. Play in Unreal Editor. Confirm pawn, ground, obstacles, steering, throttle, brake, handbrake, score, camera and reset.
5. Generate source OBJ models using `python3 tools/generate_cars.py`; import one original design into Unreal as visual static mesh only and attach to a Blueprint child of the pawn.
6. After native validation, develop a second Chaos Vehicles prototype using rigged skeletal mesh; do not falsely call a procedural OBJ a ready-to-drive Chaos vehicle.
7. Implement mobile input mapping, tuning data assets, and iOS packaging *after* the physics milestone.
8. Document screenshots, measured FPS, exact build command and any blockers in `reports/BUILD-REPORT.md`.

## Copy-paste Codex assignment
```text
Repository: pmoritz53678-del/rev-community-drift-game-
Branch: feature/ue5-drift-academy-v0
Read AGENTS.md, docs/UNREAL-SETUP.md, docs/REPO-RULES.md and docs/ASSET-IP-LICENSING.md.
Task: Validate and fix the native UE5.8 C++ prototype without editing the Schoolhouse repo.
Prove the Editor builds, track spawns, car can drift, scoreboard updates, selection changes stats, and R reset works.
Keep the model roster fictional and visually original. Record actual test results and any compile failures in reports/BUILD-REPORT.md.
Then plan (do not silently substitute) the move from arcade physics to Chaos Vehicles. Submit a PR; do not merge without approval.
```

## Avoid
- Never merge closed-course racing into Schoolhouse's existing Saturday car meet.
- Do not copy imported meshes/models from another game.
- No claims of an iPhone-ready app before Mac/Xcode signing, touch controls and device QA.
