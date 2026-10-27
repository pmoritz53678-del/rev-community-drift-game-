# REV Schoolyard Motorsports — five-track map (2026-10-27)

**Scope locked:** ONE outdoor Schoolyard campus hub and FIVE fictional closed-course tracks. Exactly 3 drift and 2 race. No separate city, real public roads or unlawful street racing.

| ID | Track | Purpose | Driving surface | Player experience |
|---|---|---|---|---|
| `north-pines` | North Pines Tandem | Drift 1 | 29 m wide | Fast flowing sweepers, space for tandem |
| `east-bowl` | East Bowl | Drift 2 | 32 m wide | Two big hairpins, carousel, linked transitions |
| `south-switch` | South Switchbacks | Drift 3 | 28 m wide | S-bends and long tandem transitions |
| `schoolyard-gp` | Schoolyard GP | Race 1 | 22 m wide | Circuit with lap sectors and checkpoints |
| `outer-express` | Outer Express | Race 2 | 30 m wide | High-speed closed express loop, optional scripted AI traffic |

All widths are first-pass game design values, not surveyed measurements. Circuit points are the canonical Catmull-Rom coordinates in `web/src/tracks.js`. `web/src/renderSchoolyard.js` generates road ribbons, shoulders, cones, signs, and the Schoolyard campus. `web/src/mapUI.js` draws a live game-coordinate minimap and a full map. Do not use GPS or claim public road accuracy.

## Drive modes

**Drift:** Lower grip, handbrake initiation, higher steering response, angle/combo/points. Scores only while on the designated drift circuit; off-track runs do not earn drift points.

**Grip / Race:** Strong traction, more stable high-speed steering, lap checkpoint logic on both race circuits, and scripted AI car traffic on Outer Express only. `M` switches physics on the same car without a mandatory reload. Modes are distinct car-handling profiles, not two separate apps. This is an arcade prototype, not a full Chaos Vehicle simulation.

## Schoolyard departments

The hub contains outdoor fronts and park-to-enter interfaces: Research Library, Quant Lab, Registrar Office, Director's Office, Strategy Workshop, REV Media Studio, Community Commons, Car Care Workshop, plus REV Garage and the separate car-meet lot. Navigate on the map, drive to an entrance, slow below 5 km/h and press **E** (or tap the on-screen prompt). Current shop interior is a functional informational modal, not a modeled indoor scene. Future Unreal version gets physical interior transitions and NPC characters.

The Saturday social car meet is **parking, viewing and conversation only**. No timed driving, races, or drift scoring there. No automotive mission can access or alter financial Schoolhouse ledgers or reports.

## QA

1. Browser starts at Parker's Garage, with both Drift and Grip entry buttons and a rotating procedural showroom car.
2. Exactly five choices (D1/D2/D3/R1/R2) show on World Map and Quick Track selector.
3. `W A S D` or arrows drive, `Space` handbrake, `M` mode change, `C` camera, `G` map, `R` restart.
4. Live map player marker moves with physics; full map and local minimap use the same world coordinates.
5. Only drift runs on the three drift tracks award drift score; lap sectors on the two race tracks require a valid circuit traversal.
6. Outer Express AI cars are purely scripted; no real users or live traffic data.
7. Department modal opens only parked and within a short distance.
8. Keyboard and touch need browser verification, and Unreal native visual/physics parity needs a separate measured build report.

## Next

Add tandem AI ghost replay, road-edge physical collision, track-out detection and authored curve design; upgrade to Chaos Vehicle rigged meshes in UE5.8 after the basic editor build. A five-track procedural blockout is *not* a finished cinematic game.
