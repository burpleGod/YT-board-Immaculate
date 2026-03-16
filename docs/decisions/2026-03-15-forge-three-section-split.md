# Decision: The Forge — Three-Section Split

**Date:** 2026-03-15
**Owner:** PM — Sarah
**Status:** Locked

## Decision

Split The Forge (Settings) page into three named sections accessed via a left sidebar navigator:

| Section | ID | Contents |
|---------|-----|---------|
| The Forge | `forge` | Per-tab theme customiser (backgrounds, colors, preview) |
| The Sanctum | `sanctum` | Creator profile, data export/import, danger zone |
| The Emissary | `emissary` | YouTube API connection — locked, coming in a future update |

## Rationale

The previous single-panel layout mixed theme customisation with data management and creator settings. As the app grows, this created a long scrollable form with no clear information hierarchy.

Splitting into three sections:
- Separates concerns — theming vs. data management vs. external integrations
- Creates space for The Emissary (Phase 5: YouTube API) without cluttering the current UI
- Uses in-world names (The Forge, The Sanctum, The Emissary) consistent with Harold vocabulary

## The Emissary — Locked Panel

The Emissary panel is intentionally locked (opacity 0.35 skeleton, `pointerEvents: none`) with lore copy explaining the feature. A system note in small muted type (`fontSize: 10, C.ash, opacity: 0.6`) separates the functional status message from the in-world voice. This pattern distinguishes Harold's narrative voice from UI system notes.

## Alternatives Considered

- **Tabs at the top of the panel** — rejected; tabs imply peer-level parity, but The Emissary is a future feature, not a current peer.
- **Keep flat layout, add anchor links** — rejected; doesn't scale past Phase 5.

## Consequences

- `TAB_LABELS` in `constants.js` extended with `ideas` and `journal` keys to support the 6-tab theme row.
- `TABS` constant is no longer used in `SettingsPage.jsx` after this change.
- The section navigator pattern is documented in `docs/patterns/forge-section-navigator.md`.
