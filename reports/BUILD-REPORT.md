# Schoolyard Motorsports — build validation

Date: 2026-10-27. **Native Unreal build unverified** (UE Editor and UnrealBuildTool unavailable in this session).

## Authored and checked
- Five original deterministic spline definitions: 3 drift, 2 race.
- Browser modules: syntax checked; static reference and physics behavior manually verified by executing pure JS source.
- Player/vehicle mode switching, AI circuit traffic, live local minimap, departments and menu wired in source.
- Playbook boundary observed: private investment Schoolhouse unchanged, Saturday car meet remains social only.

## Outstanding independent QA
- `cd web && npm install && npm test && npm run build` — execute on a machine with npm access. Package installation and Vite build NOT run here.
- Browser manual keyboard, touch and FPS test NOT run here; no real device was used.
- Unreal project `REVDrift.uproject` C++ module: NOT compiled; opens in UE5.8 only after installing the editor and building target.
- Unreal .umap level, Chaos Vehicle rig, authored 3D art, networked tandem, AI opponent battles, mobile packaging: NOT produced.

## Evidence to record
OS, GPU, UE version, node/npm versions, exact command outputs, game video, 3D course screen, 1 lap and off-track invalidation, drift/GRIP change, park-to-enter department, touch control behavior.
