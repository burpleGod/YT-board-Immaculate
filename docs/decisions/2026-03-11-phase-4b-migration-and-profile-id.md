# Decision: Phase 4B — Migration Strategy + Profile ID Slug Rule

**Date:** 2026-03-11
**Owner:** PM (Sarah)
**Phase:** 4B
**Status:** LOCKED

---

## Decision 1 — Harold Migration: Copy to ProgramData (Option B)

On first launch after Phase 4B ships, if `hg-profiles.json` does not exist
but old data exists at `app.getPath("userData")/harold-grayblood/`:

1. Copy entire old directory → `%ProgramData%\HaroldGrayblood\harold-grayblood-harold-grayblood\`
2. Verify copy succeeded (confirm `state.json` exists at destination)
3. Only after verified: delete the old AppData directory
4. Write `hg-profiles.json` pointing `dataDir` at the new ProgramData path

**Rollback rule:** If copy fails at any point, do not delete the old directory
and do not write `hg-profiles.json`. Migration retries on next launch.
Harold's data stays in AppData until a clean copy succeeds.

### Rationale

Option A (point at old path) would leave Harold's profile in AppData while all
future profiles go to ProgramData — invisible inconsistency that surfaces badly
in the Phase 4E profile switcher UI.

Option C (defer to onboarding) was Karina's recommendation but PM chose B
to keep the migration fully automatic and deliver a clean single-location
architecture from day one. The atomic copy-verify-delete pattern manages the risk.

---

## Decision 2 — Profile ID Slug Rule

All profile IDs are derived from the creator's name at creation time:

```js
id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
```

| Name | ID |
|------|----|
| Harold Grayblood | `harold-grayblood` |
| Lady Vex | `lady-vex` |
| AntlamTE | `antlamte` |

**Applies to:** migration, Phase 4C onboarding, Phase 4E profile switcher — everywhere a profile is created.

**Portrait prefix convention:** `portrait-<slug>` — e.g. `portrait-harold-grayblood`

**`dataDir` convention:** `%ProgramData%\HaroldGrayblood\harold-grayblood-<slug>\`

### Rationale

Eliminates magic strings like hardcoded `"harold"` from IPC handlers and
downstream logic. Every profile gets a consistent, predictable ID automatically.
Backend, Full Stack, and any future agents must use this derivation — not
roll their own ID format.
