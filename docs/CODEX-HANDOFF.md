# Codex handoff — current five-track Schoolyard build

The full actionable implementation brief is now **[CODEX-SCHOOLYARD-TASK.md](CODEX-SCHOOLYARD-TASK.md)**. Read that first.

Repository: https://github.com/pmoritz53678-del/rev-community-drift-game-
Branch: `feature/ue5-drift-academy-v0`

Current reality:
- `web/` contains source for a 3D Schoolyard with three drift and two race tracks, two switchable control models, garage, 15 fictional cars, scripted closed-course traffic, local minimap, and eight park-to-enter departments.
- `REVDrift.uproject` is a native source scaffold with spline import library. The project is **not** a fully built and validated UE5.8 game; there is no committed finished 3D Unreal map.
- No browser npm install, build or device gameplay smoke test was possible in this session. Source-level checks are documented in `reports/BUILD-REPORT.md`.

**Top priority:** run tests and real browser rendering, fix issues, then compile UE, export 5 splines, create a new native Schoolyard map and connect Chaos Vehicle systems. Do not touch the investment Schoolhouse repo.

Copy-paste brief:

```text
Use repo pmoritz53678-del/rev-community-drift-game-, branch feature/ue5-drift-academy-v0.
Read AGENTS.md, docs/CODEX-SCHOOLYARD-TASK.md, docs/SCHOOLYARD-TRACKS.md and docs/REUSE-ASSETS.md.
Run npm tests/build in web/, then browser QA and screenshot review.
Build Unreal Engine 5.8 scaffold and prove five-track spline import.
Use UE Vehicle Template/Chaos with license compliance, build a campus hub and three tandem drift plus two race circuits.
Keep fictional original cars and asset provenance. Do not edit You vs AI financial ledgers.
Record actual tests/defects in reports/BUILD-REPORT.md. Submit PR, no auto merge.
```