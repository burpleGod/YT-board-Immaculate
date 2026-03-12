# Decision: Seed Data Split — Generic Defaults vs Harold Seed

**Date:** 2026-02-28
**Owner:** PM (Sarah)
**Implemented:** 2026-03-11 (Phase 4D)

## Decision

Harold's personal sample data (ideas, journal entries, episodes) is **not shipped** with the production app.

- `src/constants.js` — exports `INIT_IDEAS`, `INIT_JOURNAL`, `INIT_EPISODES` as empty arrays. New users start with a blank app.
- `src/harold-seed.js` — contains Harold's personal content as `HAROLD_IDEAS`, `HAROLD_JOURNAL`, `HAROLD_EPISODES`. Not imported by the app. Available for Harold to restore his starting data manually.

## Rationale

The app is being prepared for public release (Phase 6). Shipping with Harold's personal roleplay episodes, journal entries, and ideas would:
1. Confuse new users who are not Harold
2. Mix personal brand content with the generic product
3. Force every new user to delete sample data before using the app

## What changes / what stays

| Item | Change |
|------|--------|
| `INIT_IDEAS`, `INIT_JOURNAL`, `INIT_EPISODES` in `constants.js` | Now `[]` |
| Theme, runes, fonts, aesthetic | **Unchanged** — these are brand identity (Hard Rule 16) |
| `DEFAULT_CATEGORIES` in `constants.js` | **Unchanged** — these are generic |
| Harold's personal data | Preserved in `src/harold-seed.js` |

## How to restore Harold's data

Load from the browser console while the app is running:

```js
import { HAROLD_IDEAS, HAROLD_JOURNAL, HAROLD_EPISODES } from "./harold-seed.js";
localStorage.setItem("hg_ideas",    JSON.stringify(HAROLD_IDEAS));
localStorage.setItem("hg_journal",  JSON.stringify(HAROLD_JOURNAL));
localStorage.setItem("hg_episodes", JSON.stringify(HAROLD_EPISODES));
// then refresh
```
