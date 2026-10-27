# Repository law, workflow and build gates

## Source-of-truth separation
This repository owns REV Drift Academy design, code, graphics, scores and saves. It never reads/writes the original Schoolhouse ledgers. The Schoolhouse's Saturday meet is social only; drift races happen on fictional/private tracks and are represented as separate experiences.

## Changes
1. Feature branches and pull requests; only the owner ratifies gameplay/monetization-policy changes.
2. Codex must report actual tests run vs tests not possible; UE compile can't be claimed without Unreal Editor or UnrealBuildTool evidence.
3. Every new car gets a catalog ID, unique name, authored mesh, asset provenance, drive layout, basic handling tuning and six-angle visual review.
4. Scores and player stats are game-only, with deterministic/replayable validation planned; do not store financial, location or health data.
5. Respect Git LFS for large proprietary author-owned assets; no binary engine folders, private API keys, credentials, paid plugins, third-party copyrighted art or real trademarks in commits.
6. Keep mobile build performance budgets, controls and accessibility in scope; target stable 30 FPS on a specified low-end test device before adding expensive reflections/smoke.
7. Keep user safety/consumer trust: driving games should not glorify dangerous real-world street racing; avoid misleading safety/police markings.
8. Protect public branch with GitHub ruleset (require PR/review/checks) when project owner configures repository settings; this connector cannot author admin rulesets.

## Branch checklist
- [ ] Branch from latest main
- [ ] Add/update README index and design doc
- [ ] Unit/catalog tests run
- [ ] Browser JS syntax check and manual play test
- [ ] Unreal build/test evidence (when changing UE C++)
- [ ] Visual similarity/IP approval for new vehicles
- [ ] Keyboard and touch review for UI changes
- [ ] No copied Schoolhouse investment files or secrets
- [ ] Owner approves merge and any store release

## License policy
No open-source license has been granted for the original project source in this branch. Default copyright applies until the owner decides. Unreal Engine and other third-party dependencies retain their separate terms; see `docs/ASSET-IP-LICENSING.md`.
