# Pattern: Forge Section Navigator

**Established:** 2026-03-15
**Location:** `src/pages/SettingsPage.jsx`

## Overview

A two-column layout used in The Forge (Settings) page. A left sidebar provides top-level section navigation; the right panel renders the active section's content. Within a section, a secondary horizontal tab row handles per-tab theme selection.

## Layout

```
┌──────────────┬──────────────────────────────────────┐
│ Left sidebar │ Right panel                          │
│              │                                      │
│ ⚒ THE FORGE  │  [section content]                   │
│ 📜 SANCTUM   │                                      │
│ 🔮 EMISSARY  │                                      │
└──────────────┴──────────────────────────────────────┘
```

Grid: `gridTemplateColumns: "200px 1fr"`, `gap: 24`.

## Section Navigator Buttons

Each sidebar button is a flex column with:
- Large emoji icon (`fontSize: 18`)
- Section name in Cinzel (`fontSize: 10, letterSpacing: 2`)
- Subtitle description (`fontSize: 9, letterSpacing: 1`)

Active state: `rgba(212,168,67,0.1)` background, `accent` border and color.
Inactive state: `rgba(0,0,0,0.4)` background, `C.ashDim` border, `C.ash` color.

## Secondary Tab Row (Forge section only)

Horizontal row of `THEME_TABS` buttons rendered inside the right panel before the content boxes. Clearing `showGalleryPicker` on tab switch prevents stale picker state.

## Locked Panel Pattern (Emissary)

For future/locked features:
1. Lore heading — `fontSize: 13, letterSpacing: 3, color: accent, fontFamily: Cinzel`
2. Lore body — `fontSize: 14, color: ts.fontColor, fontFamily: Crimson Text`
3. `<hr>` divider (`height: 1, background: C.ashDim`)
4. Locked form skeleton — `opacity: 0.35, pointerEvents: "none"`
5. System note — `fontSize: 10, color: C.ash, opacity: 0.6` — visually distinct from lore voice

The system note must be noticeably smaller and more muted than the lore body to signal it is a functional note, not in-world copy.

## Section Data

Defined as a local constant inside the component (not exported) to keep it co-located with the JSX:

```js
const FORGE_SECTIONS = [
  { id: "forge",    icon: "⚒",  name: "THE FORGE",    sub: "..." },
  { id: "sanctum",  icon: "📜", name: "THE SANCTUM",  sub: "..." },
  { id: "emissary", icon: "🔮", name: "THE EMISSARY", sub: "..." },
];
```

## Reuse Notes

- The sidebar pattern can be reused for any multi-section settings-style page.
- `FORGE_SECTIONS` and `THEME_TABS` are local constants — do not extract to `constants.js` unless a second consumer appears.
