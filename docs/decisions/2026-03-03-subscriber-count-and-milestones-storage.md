# Decision: subscriberCount + milestonesThresholds Storage Locations

**Date:** 2026-03-03
**Owner:** Backend
**Phase:** 4B
**Status:** LOCKED

## Decision

| Field | Location | Reason |
|-------|----------|--------|
| `subscriberCount` | `state.json` (per-profile) | Runtime state — changes frequently, user updates manually in The Forge |
| `milestonesThresholds` | `hg-profiles.json → profile.settings` | Display preference — set once per creator, not volatile runtime data |

## Detail

### subscriberCount

- Type: `number`, default `0`
- Lives in the state object written by `hg:writeState` / read by `hg:readState`
- Added to root state in `HaroldGrayblood.jsx` as `subscriberCount` / `setSubscriberCount`
- Persisted via the Option A IPC write useEffect alongside all other app state
- Consumed by `SettingsPage` (The Forge) for manual update; will flow to `CharacterCard` in Phase 5G

### milestonesThresholds

- Type: `number[]`, default `[100, 500, 1000, 5000, 10000, 50000, 100000]`
- Lives in `hg-profiles.json → profiles[n].settings.milestonesThresholds`
- Set once during onboarding (Phase 4C) or profile creation (Phase 4E)
- Does not need to be in volatile state — reading it requires `hg:readProfiles`

## Rationale

Mixing display preferences into `state.json` would make the file grow unbounded
as more per-profile settings accumulate. Separating volatile runtime state
(`state.json`) from stable preferences (`profiles.json`) keeps the data model clean
and makes profile imports/exports tractable.
