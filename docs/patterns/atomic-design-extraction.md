# Atomic Design Extraction Patterns

## Phase 3E — Templates + Pages

### Extraction Workflow (per component)

1. Read source lines in HaroldGrayblood.jsx
2. Create `src/{layer}/{Name}.jsx` with correct relative imports
3. Named export only: `export { Name }` (no default exports in components)
4. Add `import { Name } from "./{layer}/{Name}.jsx"` to HaroldGrayblood.jsx
5. Delete inline function definition from HaroldGrayblood.jsx
6. `npm test` — must be 1/1 green
7. `git commit -m "feat(3E): extract {Name}"`

### Import Path Rule

All extracted files use imports relative to their own directory:
- `../constants.js`
- `../utils.js`
- `../atoms/Button.jsx`
- `../molecules/PageHeader.jsx`
- `../templates/PageShell.jsx`

### Deferred Import Pattern

When a component (e.g. `TwoColumnLayout`) is created for use by a *page* that hasn't been
extracted yet, do NOT import it into HaroldGrayblood.jsx. Import it directly in the page file
once that page is extracted. This keeps HaroldGrayblood.jsx free of unused imports at every
commit checkpoint.

### Edit Tool "File Not Read" Error

The Edit tool requires the file to have been read in the current session before it can be
edited. If you get "File has not been read yet", read the relevant lines first, then retry the
edit. This is a safety guardrail, not a bug.

### File Truncation via PowerShell

When orphaned code needs to be removed from the end of a file (e.g. after a partial edit),
use PowerShell array slicing:

```powershell
(Get-Content 'path/to/file.jsx')[0..N] | Set-Content 'path/to/file.jsx'
```

`N` is zero-indexed, so to keep 155 lines use `[0..154]`.
Do NOT use `&&` inside `-Command` strings in PowerShell — use `;` or separate calls.

### Post-Phase Import Cleanup

After all pages are extracted, audit HaroldGrayblood.jsx for imports that were only needed
by the now-extracted components. Only keep imports that are directly referenced in the root
component body. Remove all others to keep the root lean.

### Final State (after Phase 3E)

- `src/HaroldGrayblood.jsx`: 128 lines — imports, global styles, state, effects, switchTab/updateTheme helpers, root render
- `src/templates/`: PageShell, Box, TabBackground, TwoColumnLayout (4 files)
- `src/pages/`: SkyrimPage, IdeasPage, JournalPage, YouTubePage, GalleryPage, SettingsPage (6 files)
- `src/molecules/Nav.jsx`: extracted in 3E
- `src/organisms/FullscreenJournal.jsx`: extracted in 3E
