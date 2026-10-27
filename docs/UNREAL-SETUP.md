# Unreal Engine 5.8 setup — REV Schoolyard Motorsports

Epic's UE 5.8 was announced June 2026. Install the editor from https://www.unrealengine.com/download. This repo currently holds an **uncompiled native project scaffold**, not an existing finished Unreal game.

## 1. Prepare your computer

- Windows: Epic Games Launcher + Unreal Engine 5.8, compatible Visual Studio 2022/C++ workload, Unreal tools, Windows SDK, plenty of free disk space.
- macOS: supported Unreal build and Xcode toolchain. For iPhone packaging, supported macOS signing, certificates, provisioning profiles and current Apple SDKs are needed.
- An iPhone can play *packaged* games; it is not the Unreal Editor development machine.

## 2. Checkout the feature

```bash
git clone https://github.com/pmoritz53678-del/rev-community-drift-game-.git
cd rev-community-drift-game-
git checkout feature/ue5-drift-academy-v0
git lfs install
node tools/export_unreal_tracks.mjs
```

This generates five editable course CSVs under `Generated/Tracks/`, each with 240 spline positions. Coordinates are converted from web meters to UE centimeters. The five circuits have distinct widths (28–32m drift, 22/30m race).

## 3. Open the Unreal scaffold

Open `REVDrift.uproject` with Unreal 5.8. Build/recompile the C++ module. `UREVSchoolyardSplineLibrary::LoadSchoolyardTrack` is designed to fill an Unreal Spline Component from one CSV by track ID. **This library has not yet been compiled in UE**, and it produces the spline centerline, not a finished road surface.

Create `Content/Maps/Schoolyard.umap` in Unreal. Set the game default map once validated; do not assume it already exists.

## 4. Save time with the official vehicle example

In Epic's Game Project Browser inspect the **Vehicle Template** and its **Timetrial** variant; they supply drivable baseline physics, cameras, UI, and course checkpoints. Reuse only according to the Unreal Engine EULA. Integrate it into this project via editor-managed assets or recreate a clean variant. Avoid committing proprietary engine internals or third-party content to the public repo without clear licensing.

Guide: https://dev.epicgames.com/documentation/unreal-engine/vehicle-template-in-unreal-engine

## 5. Convert the spline rows into roads

Use a Blueprint actor with a Spline Component for each track, call `LoadSchoolyardTrack(Spline, TrackId, WidthCm)`, then distribute Spline Mesh Components with an original or properly licensed road mesh along the route. Set track collision, inside/outside boundary detection, catch fences, kerbs and checkpoint gates. Width is already exported.

Build the central outdoor Schoolhouse plaza with eight park-and-enter departments, the garage and separate social car-meet parking. No racing or timed activities in the meet area.

## 6. Match the two handling profiles

Use Chaos Vehicle skeletal/rigged bodies with wheel definitions and physics tuning. Make handling an editable profile rather than swapping cars: DRIFT (controlled rear slip/steering lock) and GRIP (stable high-speed road course). AI traffic runs **only on fictional Outer Express**; no connection to real highways or GPS. Save single-player course results locally.

## 7. Actual QA before claiming a game

Prove editor launch, one drivable car, all five roads, valid lap, drift points, live world map, department parking interaction, mobile touch pass and objective framerate. Record engine version, actual compile log and screenshots in `reports/BUILD-REPORT.md`.

Browser prototype instructions are in `README.md` (`cd web && npm install && npm run dev`); it is a separate Three.js/Vite experience, not a packaged Unreal app.