# Unreal Engine setup — REV Drift Academy

## A. Install
1. On a suitable Windows or Mac computer, visit https://www.unrealengine.com/download and download **Epic Games Launcher**.
2. Install launcher, sign in to Epic, open **Unreal Engine > Library**, and install a launcher Unreal 5 build. This starter targets **5.8**; if using another version, switch project version and record API adjustments.
3. For Windows C++ development install Visual Studio 2022 with **Game development with C++**, Windows SDK and the Unreal tools/components. macOS requires compatible Xcode and platform SDKs.
4. Check workstation specs (practical recommendation: 32 GB RAM, capable dedicated GPU, 8 GB GPU VRAM); Unreal Editor generally cannot be used on an iPhone. Source: https://dev.epicgames.com/documentation/unreal-engine/hardware-and-software-specifications-for-unreal-engine

## B. Open source
```bash
git clone https://github.com/pmoritz53678-del/rev-community-drift-game-.git
cd rev-community-drift-game-
git checkout feature/ue5-drift-academy-v0
git lfs install
git lfs pull
```
Right-click `REVDrift.uproject` (Windows) to generate Visual Studio project files or open the project in the Launcher/Unreal Editor. If prompted, rebuild missing C++ modules; any compile errors must be fixed and logged before claiming playable Unreal build.

## C. First Editor test
- The starter uses only built-in mesh primitives. It does NOT require imported vehicle assets or the Chaos plugin yet.
- Configure/start the project. The default startup Engine Entry map is used as a code-spawned sandbox; the GameMode creates a simple flat test area and barricades.
- Play In Editor (PIE). Use W/S throttle/reverse, A/D steer, Space handbrake, R reset, keys 1–6 switch stats; view speed, angle, and drift points in HUD.
- If no visible pawn spawns, review `Config/DefaultEngine.ini`, `Source/REVDrift/REVDriftGameMode.cpp`, and World Settings GameMode override.
- Treat C++ as **unverified until you run it locally**. Attach build report with engine version, OS, compilation log and video/screenshot.

## D. Import original cars
```bash
python3 tools/generate_cars.py
```
Open Unreal Editor > Content Browser > create `Content/Vehicles/Prototypes` > Import generated `assets/generated/OBJ/*.obj` files. These are static render meshes, **not** Chaos skeletal vehicle rigs. Verify import scaling (Unreal uses centimeters, generator outputs centimeters) and orientations; adjust the render mesh on a Blueprint subclass of the driving pawn. Keep the pawn collision root as authority for the prototype.

## E. Progress to realistic vehicle physics
Follow https://dev.epicgames.com/documentation/unreal-engine/how-to-set-up-vehicles-in-unreal-engine :
1. Enable **ChaosVehiclesPlugin** and restart.
2. Rig an original vehicle body as Skeletal Mesh (root + wheel bones) and create Physics Asset.
3. Build wheel Blueprints and set steering/engine/handbrake by axle.
4. Engine torque curve, differential, gear ratios, center of mass, suspension/tire friction.
5. Vehicle Animation Blueprint / wheel controller, vehicle pawn Blueprint, and action mappings.
6. Simulate, tune and measure performance before mobile port.

## F. Mobile after a desktop playable
- iOS requires a supported Mac/Xcode signing setup, certificates/profiles and current App Store submission toolchain. Android requires compatible SDK/NDK configuration.
- Unreal Editor runs on a computer; the packaged **game** runs on a phone.
- Implement touch steering, throttle/brake and handbrake, UI safe areas, graphics scalability, crash reporting and privacy disclosures; test on devices before any store upload.
- License and release guidance: `docs/ASSET-IP-LICENSING.md`.

## G. Browser test right now
Open `play/index.html` in Chrome/Safari/Edge; no compiler and no third-party assets are required. For a local server, from repo root: `python3 -m http.server 8000`, then visit `http://localhost:8000/play/`.
