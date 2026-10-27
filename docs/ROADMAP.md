# Milestones

## Stage 0 — current starter
- [x] Independent GitHub repo identified
- [x] Original 15-car catalog drafted
- [x] Repo/Codex rules, engine project source and browser practice demo authored
- [ ] Native Unreal build and Editor test **not yet verified**
- [ ] Browser manual touch/device smoke test by owner
- [ ] Imported, reviewed and textured original car art

## Stage 1 — First playable closed-course
- Unreal project opens on selected UE build
- One simple test track, drivable pawn with steering, acceleration, handbrake, HUD
- Drift angles, score, reset and basic 6-car switch
- Low-poly original 3D static meshes as render-only visuals
- Source control and smoke tests pass

## Stage 2 — Proper physics and garage
- Replace simple arcade movement with Chaos Vehicle physics using a *rigged skeletal mesh*, 4 wheel assets, suspension, tire/friction curves, mass transfer and torque curve
- Garage, tuning (diff, gearing, tires, steering lock, alignment, weight), saved presets
- Controller + on-screen mobile controls, camera modes, tire smoke, road sounds and replays
- Data-driven original car models with LODs and legal provenance

## Stage 3 — Missions and local mode
- Structured drift tutorials, clipping cones, zones, solo time attack on fictional tracks, AI ghosts
- Offline progression with clearly disclosed local storage
- 30 FPS baseline on designated lower-end phone; scalable effects

## Stage 4 — Online optional
- Dedicated room matchmaking / authoritative scoring / anti-cheat; avoid P2P score authority
- Club meets and photo mode **without street racing**
- Consent-based telemetry and moderation if adding user-generated liveries / public names
- Store QA, rights review and release gate

## Acceptance criteria for initial playable
1. On hardware, WASD accelerates/steers and Space triggers handbrake.
2. A continuous drift at speed and angle above threshold generates points; driving straight does not.
3. Reset restores safe spawn, clears score and removes stale inputs.
4. Car selection changes name and handling.
5. Track edges prevent unrestricted travel.
6. No real trading, real-world unsafe-driving objective or external network calls.
7. Compile and runtime results are documented honestly.
