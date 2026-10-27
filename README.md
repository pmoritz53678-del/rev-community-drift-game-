# REV Community Drift Game

> **Independent, original drift game.** Unreal Engine 5.8 C++ starter + browser-playable arcade proof of concept.
> **Current status:** starter source committed for Codex / UE Editor validation; not yet a compiled or App Store-ready mobile game.

## Two ways to start

**Play immediately (browser):** Open `play/index.html` in a desktop browser (WASD / arrow keys, Space to handbrake, R to reset, 1-8 to switch cars). Touch controls are supported. No services or payments are connected.

**Build the Unreal version:** Install Unreal Engine from https://www.unrealengine.com/download; open `REVDrift.uproject` in Unreal Engine 5.8 and build the C++ module. See [Unreal setup](docs/UNREAL-SETUP.md). The Unreal C++ playable sandbox uses procedural engine primitives until imported original vehicle meshes are set up.

## What is actually in this repository
- `play/` — standalone playable 2D top-down drift proof-of-concept with 8 select-able fictional cars and local scoring.
- `REVDrift.uproject`, `Config/`, `Source/` — Unreal 5.8 C++ prototype (original simple arcade handling, test track, HUD, vehicle selection).
- `data/vehicles.json` — 15 original vehicle designs and parameters (not licensed real car replicas). Eight are available in browser proof-of-concept; Unreal currently has six preset classes.
- `tools/` — generated, unbranded, low-poly OBJ concept cars suitable for test importing.
- `docs/` — installation, design, IP, governance, art workflow, roadmap, tests and Codex handoff.
- `AGENTS.md` — rules for Codex and contributors.
- `.github/workflows/` — automated data/script validation; Unreal Editor compilation still requires an actual Unreal installation.

## Identity
REV Community focuses on car culture and people: organized community meets, authentic enthusiast stories, creative projects and respectful events. Drift Academy is the game's clearly labeled **closed-course training mode**; real Saturday community meets are **social only, no racing**.

This repository is independent from the `you-vs-ai--the-game-` investment Schoolhouse, which remains governed by its own playbook and ledgers. Nothing here has trading, portfolio, payment or brokerage authority.

## Where to go next
1. [Installation and first play](docs/UNREAL-SETUP.md)
2. [Vehicle roster and GTA-style originality approach](docs/VEHICLE-ROSTER.md)
3. [Codex implementation handoff](docs/CODEX-HANDOFF.md)
4. [Repository rules and quality gates](docs/REPO-RULES.md)
5. [IP and publishing compliance](docs/ASSET-IP-LICENSING.md)
6. [Roadmap and acceptance tests](docs/ROADMAP.md)

**Important:** Do not share Epic engine source, paid Marketplace assets, trademarked badges or copied game maps in this public repository. All vehicles and fictional marks are provisional originals pending review.
