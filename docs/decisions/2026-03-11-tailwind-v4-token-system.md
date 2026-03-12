# Decision: Tailwind CSS v4 + CSS Custom Property Token System

**Date:** 2026-03-11
**Owner:** DevOps (Mylo), verified by Full Stack (Karina)
**Phase:** 4A

## Decision

Tailwind CSS v4 is installed via `@tailwindcss/vite`. All Harold theme values are defined as CSS custom properties in `src/index.css`. Typed theme objects are exported from `src/themes/harold.ts` and `src/themes/base.ts`.

Tailwind adoption is **incremental** (Hard Rule 14). No component inline styles are changed in Phase 4A. Tokens exist for Phase 5 migration.

## Implementation

| File | Change |
|------|--------|
| `package.json` | Added `tailwindcss@next`, `@tailwindcss/vite` |
| `vite.config.mjs` | Renamed from `.js` (ESM required); added `tailwindcss()` plugin |
| `src/index.css` | New — `@import "tailwindcss"` + 13 core + 7 calendar `:root` tokens |
| `src/main.jsx` | Added `import './index.css'` |
| `src/themes/harold.ts` | New — typed Harold dark fantasy theme object |
| `src/themes/base.ts` | New — typed neutral fallback theme |

## Token coverage

All values in `src/constants.js` `C` object and all `CAL_*` standalone constants are mapped to CSS custom properties.

## C.ash normalisation

`C.ash = "#666"` (3-digit CSS shorthand). Normalised to `#666666` in both `src/index.css` and `src/themes/harold.ts`. **Do not string-compare C.ash against theme token values without normalising.** Comment added at point of use.

## ESM compatibility fix

`@tailwindcss/vite` is ESM-only. Vite 5's config loader uses esbuild to bundle the config, which then tries to `require()` ESM modules — this fails. Fix: rename `vite.config.js` → `vite.config.mjs`, which forces Node.js to load it as an ES module directly, bypassing esbuild bundling.

**If others add Vite plugins and see this error:**
```
"@some-plugin" resolved to an ESM file. ESM file cannot be loaded by `require`.
```
The fix is always the same: rename `vite.config.js` → `vite.config.mjs`.

## Preflight risk

Tailwind v4's `@import "tailwindcss"` includes CSS preflight (normalize/reset). In Phase 4A, no regression was observed. If regression appears in future phases, add `@layer base { }` overrides to `src/index.css`. The bailout comment is already in place.
