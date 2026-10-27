# Public source assets — verified candidates and import policy

These publicly available sources can save weeks of blockout and art work. **Not yet imported** into the game repository: this document is a curated reuse plan and license record, not a claim that external binary packs have been downloaded.

| Source | License stated by publisher | What to reuse | Important restrictions |
|---|---|---|---|
| [Kenney Racing Kit](https://kenney.nl/assets/racing-kit) | CC0, 110 assets | Barriers, course tiles, signage stands, flags, pit stops, fences | Download pack at official source, retain provenance record; replace prototype tracks with custom geometry |
| [Kenney Car Kit](https://kenney.nl/assets/car-kit) | CC0, 45 assets | Generic unbranded parking cars, tire/wheel placeholders, traffic cars | Never claim these as original 15-car silhouettes; keep separate from player hero models |
| [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | CC0 (verify live pack page) | Trees, foliage, landscaping, rocks and campus background | Mobile LOD, draw-call and batching review needed |
| [Quaternius](https://quaternius.com) | License varies per pack; many CC0 | Campus buildings and rigged character placeholders | Read exact selected pack license before download or redistribution |
| [pmndrs/racing-game](https://github.com/pmndrs/racing-game) | MIT repo code; assets described as CC0 | Review camera, state management, skids/trails and performance patterns | Keep MIT notice when actually copying code; React/Three/Fiber implementation may require adaptation to this Vanilla Three.js/Vite project |
| [Epic Unreal Vehicle Template](https://dev.epicgames.com/documentation/unreal-engine/vehicle-template-in-unreal-engine) | Epic Unreal EULA | Official drivable car, camera, time trial checkpoints, UI and Chaos physics foundation | Use through authorized installed Unreal editor; don't upload engine sources or Epic content to third-party open projects improperly |

## Preferred fast-path

1. Build a complete and testable garage-to-track loop with the existing procedural geometry first.
2. Import *Kenney Racing Kit* modular props around the five **original** spline circuits. Don't replace Schoolyard geometry with any copyrighted GTA, Roblox or No Hesi track extraction.
3. Import unbranded *Kenney Car Kit* bodies for traffic only. Build original concept cars for players and review front/side/rear resemblance to manufacturer protected designs.
4. Import a Quaternius/CC0 campus package only after verifying that exact pack's terms, then replace placeholder department blocks one department at a time.
5. For Unreal, start with Epic's own Vehicle + Time Trial template, and use `node tools/export_unreal_tracks.mjs` followed by the project spline loader to transfer all five circuits.
6. Record all imports in `docs/ASSET-LEDGER.csv` (creator, exact source URL, asset ID/version, license, date, transformations, notice and distribution permission).
7. Before publication, audit music, brands, character likenesses, real car trade dress, asset files and store restrictions. No claim of endorsement by publishers or automakers.

**Source checks (October 27, 2026):**
- Kenney official Racing Kit page explicitly states **Creative Commons CC0** and **110 files**.
- Kenney official Car Kit page explicitly states **Creative Commons CC0** and **45 files**.
- pmndrs racing-game GitHub project lists **MIT** and identifies its own assets as CC0.
- Epic Vehicle Template documentation describes a Chaos-compatible car and Timetrial map with checkpoints; Epic EULA still governs it.
- Always re-check source version and included file licenses at download time, and preserve the actual license text in the asset ledger.
