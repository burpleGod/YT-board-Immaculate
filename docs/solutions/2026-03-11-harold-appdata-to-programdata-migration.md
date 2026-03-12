# Solution: Harold AppData → ProgramData Migration

**Date:** 2026-03-11
**Phase:** 4B
**Author:** Karina (Full Stack)

## Problem

Before Phase 4B, Harold's data lived at:
```
%AppData%\harold-grayblood\
  state.json
  images\
```

Phase 4B introduces `hg-profiles.json` at `%ProgramData%\HaroldGrayblood\` and
requires all profile data directories to live under ProgramData. Harold's existing
AppData directory must be migrated without data loss.

## Solution

Atomic copy-verify-delete on first launch after 4B ships (PM-approved Option B).

### Trigger condition

`app.whenReady()` startup — when `readProfilesFile()` returns `null` (no profiles file)
but `state.json` exists at the old AppData path.

### Steps executed

1. **Copy** entire `%AppData%\Roaming\harold-grayblood\` → `%ProgramData%\HaroldGrayblood\harold-grayblood-harold-grayblood\` using `fsp.cp(..., { recursive: true })`
2. **Verify** copy succeeded — `fsp.access(newDataRoot/state.json)` throws if missing
3. **Delete** original only after verify — `fsp.rm(oldDataRoot, { recursive: true, force: true })`
4. **Write** `hg-profiles.json` pointing `dataDir` at new ProgramData path

### Rollback rule

If any step throws (copy fails, verification fails, disk full, permissions error):
- The `catch` block swallows the error and leaves `activeProfile = null`
- `hg-profiles.json` is not written
- Old AppData data is not deleted
- On next launch the migration retries from scratch

Harold's data is never deleted before a verified copy exists at the destination.

## Implementation location

`electron/main.cjs` — `app.whenReady()` handler, startup sequence block (lines ~121–160).

## Known limitations

- `fsp.cp` requires Node.js 16.7+. Electron 37 ships Node 22 — no issue.
- If ProgramData write is blocked by Windows permissions (unlikely for user-installed
  apps), migration silently defers. Harold continues from AppData until a successful
  migration completes.
- No progress UI during migration — migration is fast (local copy) and silent by design.
  Phase 4C onboarding UI can optionally surface a "migrating your data..." message.
