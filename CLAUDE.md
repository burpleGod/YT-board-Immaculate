# CLAUDE.md — AI Assistant Guide for YT-Board-Immaculate

## Project Overview

**Harold Grayblood** is a cross-platform Electron + React desktop dashboard built for YouTube content creators, specifically Skyrim/fantasy roleplay creators. It provides:

- **YouTube Pipeline** — episode production tracking (planned → scripted → recorded → edited → uploaded)
- **Idea Ledger** — categorized notes and ideas board
- **Roleplay Journal** — rich-text diary with per-entry font/size/alignment formatting
- **Gallery** — image management with captions, tags, and categories
- **The Forge** — per-tab UI customizer (backgrounds, accent colors, overlays, slideshows)
- **Auto-updater** — GitHub Releases integration via electron-updater

The codebase is intentionally a **monolithic single-component architecture** — the vast majority of logic lives in `src/HaroldGrayblood.jsx`.

-----

## Repository Structure

```
YT-board-Immaculate/
├── index.html                      # Vite HTML entry point
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite + Vitest configuration
├── src/
│   ├── main.jsx                    # React DOM entry (renders HaroldGrayblood)
│   ├── HaroldGrayblood.jsx         # MAIN FILE — entire app (~1600 lines)
│   ├── HaroldGrayblood.test.jsx    # Smoke tests
│   └── test-setup.js               # Vitest setup (jest-dom + matchMedia mock)
├── electron/
│   ├── main.cjs                    # Electron main process (~200 lines)
│   └── preload.cjs                 # Context-bridge IPC preload (~15 lines)
├── harold-grayblood-v3_4_1.jsx     # Archive/reference snapshot — do not edit
└── README.md
```

**Note:** An Atomic Design refactor is approved and in progress (see Atomic Design section below). The structure above reflects the current state. Post-refactor structure will include `src/atoms/`, `src/molecules/`, `src/organisms/`, `src/templates/`, and `src/pages/`.

-----

## Tech Stack

|Layer        |Technology                                                     |
|-------------|---------------------------------------------------------------|
|UI Framework |React 18.3 (functional components + hooks)                     |
|Build Tool   |Vite 5.4                                                       |
|Desktop Shell|Electron 37                                                    |
|Testing      |Vitest 2.1 + @testing-library/react + jsdom                    |
|Packaging    |electron-builder (NSIS installer for Windows)                  |
|Auto-Update  |electron-updater → GitHub Releases                             |
|Fonts        |@fontsource packages (Cinzel, Kalam, EB Garamond, Crimson Text)|
|Styling      |Inline CSS-in-JS (no CSS files, no CSS framework)              |
|State        |React hooks (useState/useEffect/useRef) — no Redux/Zustand     |
|Persistence  |Browser localStorage + Electron filesystem (IPC)               |

-----

## Key Scripts

```bash
npm run dev              # Vite dev server (browser preview, hot reload)
npm run electron:dev     # Full Electron app in dev mode
npm run build            # Vite production build
npm run electron:build   # Full Windows NSIS installer build
npm run test             # Vitest test suite (run once)
npm run preview          # Preview the Vite production build
```

-----

## Architecture Deep-Dive

### Single-Component Pattern

All page components (`SkyrimPage`, `IdeasPage`, `JournalPage`, `YouTubePage`, `GalleryPage`, `SettingsPage`) and all helper functions are defined **inside `src/HaroldGrayblood.jsx`**. See the Atomic Design section below for the approved refactor plan.

### State Management

State is managed at the top level of `HaroldGrayblood` and passed as props:

- `ideas` / `setIdeas` — idea board entries
- `journal` / `setJournal` — journal entries
- `episodes` / `setEpisodes` — YouTube episode pipeline
- `gallery` / `setGallery` — gallery images
- `themeSettings` — per-tab UI theme configuration
- `activeTab` — current tab selection

`useEffect` hooks persist state to `localStorage` whenever state changes.

### Data Models

**Idea:**

```js
{ id: number, category: string, title: string, content: string, tags: string[] }
```

**Journal Entry:**

```js
{ id: number, date: string, title: string, body: string,
  format: { font: string, size: number, align: string, bold: bool, italic: bool } }
```

**Episode:**

```js
{ id: number, title: string, episode: string, status: string,
  description: string, thumbnail: string, thumbnailName: string,
  tags: string[], notes: string, scheduledDate: string }
// status: "planned" | "scripted" | "recorded" | "edited" | "uploaded"
```

**Gallery Image:**

```js
{ id: number, src: string, name: string, caption: string, tag: string, category: string }
// src: base64 data URL or "hgdata://images/<id>"
```

**Theme Settings (per-tab):**

```js
{ bgImages: string[], bgMode: string, bgOverlay: number,
  accentColor: string, boxBg: string, fontColor: string, slideshowInterval: number }
```

### localStorage Keys

All keys are prefixed `hg_`:

|Key                    |Contents                                                       |
|-----------------------|---------------------------------------------------------------|
|`hg_ideas`             |Ideas array                                                    |
|`hg_journal`           |Journal entries array                                          |
|`hg_episodes`          |Episodes array                                                 |
|`hg_categories`        |Custom idea categories                                         |
|`hg_gallery`           |Gallery image metadata                                         |
|`hg_gallery_categories`|Gallery category names                                         |
|`hg_theme_meta`        |Theme settings (no images)                                     |
|`hg_theme_images`      |Theme background images (base64, stored separately due to size)|

### Electron IPC

The preload (`electron/preload.cjs`) exposes `window.hgStorage` to the renderer:

```js
window.hgStorage.readState()              // → Promise<object>
window.hgStorage.writeState(state)        // → Promise<void>
window.hgStorage.saveImage(id, base64)    // → Promise<void>
window.hgStorage.deleteImage(id)          // → Promise<void>
window.hgStorage.readAllImages()          // → Promise<{ id: string, data: string }[]>
window.hgStorage.getVersion()             // → Promise<string>
window.hgStorage.installUpdate()          // → void
```

**Custom protocol:** `hgdata://images/<id>` serves image files from the Electron userData directory.

**File storage path:** `app.getPath("userData")/harold-grayblood/`

- `state.json` — serialized application state
- `images/` — binary image files

-----

## Atomic Design Refactor — Approved

**Status:** Approved by PM. Not yet executed. Awaiting return to local machine.

The monolithic `HaroldGrayblood.jsx` is approved for refactoring into an Atomic Design component hierarchy. This is a structural refactor only — no visual changes, no behavioral changes, no new dependencies.

### Approved File Structure (post-refactor)

```
src/
├── main.jsx
├── HaroldGrayblood.jsx       ← root only: state, routing, persistence
├── constants.js              ← C, TABS, TAB_LABELS, RUNES, STATUS_COLORS etc.
├── utils.js                  ← hexToRgb (fixed), loadState, saveState, etc.
├── atoms/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Label.jsx
│   ├── Tag.jsx
│   ├── EmptyState.jsx
│   └── Divider.jsx
├── molecules/
│   ├── FilterBar.jsx
│   ├── CategoryManager.jsx
│   ├── StatusBadge.jsx
│   ├── FormRow.jsx
│   └── PageHeader.jsx
├── organisms/
│   ├── IdeaCard.jsx
│   ├── JournalEntryRow.jsx
│   ├── EpisodeRow.jsx
│   ├── EpisodeCard.jsx
│   ├── EpisodeForm.jsx
│   ├── JournalEntryForm.jsx
│   ├── GalleryCard.jsx
│   ├── YouTubeCalendar.jsx
│   └── ChannelBanner.jsx
├── templates/
│   ├── PageShell.jsx
│   ├── TwoColumnLayout.jsx
│   └── TabBackground.jsx
└── pages/
    ├── SkyrimPage.jsx
    ├── IdeasPage.jsx
    ├── JournalPage.jsx
    ├── YouTubePage.jsx
    ├── GalleryPage.jsx
    └── SettingsPage.jsx
```

### Refactor Phase Plan

|Phase|Task                                                              |Status   |
|-----|------------------------------------------------------------------|---------|
|A    |Extract constants.js + utils.js. Fix `hexToRgb()` for rgba inputs.|🔜 Next   |
|B    |Extract atoms/                                                    |🔜 Pending|
|C    |Extract molecules/                                                |🔜 Pending|
|D    |Extract organisms/ (commit per organism)                          |🔜 Pending|
|E    |Extract templates/ + pages/                                       |🔜 Pending|

### Refactor Rules

- `npm test` must pass (1/1) after every phase before proceeding
- `HaroldGrayblood.jsx` filename must never change
- Inline styles preserved — no CSS files, no Tailwind
- No visual or behavioral changes at any phase
- Phase D: commit after each individual organism, not per phase
- `hexToRgb()` must be fixed for rgba inputs during Phase A

-----

## Styling Conventions

### Color System

All colors are defined in the `C` object at the top of `HaroldGrayblood.jsx` (moving to `constants.js` during refactor):

```js
C.black, C.ember, C.gold, C.ash, C.fog, ...
```

Always use `C.<n>` for colors — never hardcode hex values inline.

### Style Helpers

Reusable style factories defined in `HaroldGrayblood.jsx`:

- `themedInput(theme)` — styled input/textarea
- `ghostBtnStyle(theme)` — transparent button
- `accentBtnStyle(theme)` — accent-colored button

### Animation

CSS `@keyframes` are injected via a `<style>` element. Common keyframes:

- `fadeUp`, `slideIn`, `popIn`, `tabEnter`, `calEnter`, `runeGlow`, `fogDrift`, `starTwinkle`

### No CSS Files

There are **no `.css` files**. All styles are inline objects or injected `<style>` tags. Do not introduce CSS files or CSS modules.

-----

## Naming Conventions

|Type             |Convention      |Example                       |
|-----------------|----------------|------------------------------|
|React components |PascalCase      |`HaroldGrayblood`, `IdeasPage`|
|Helper functions |camelCase       |`hexToRgb`, `sanitizeFileName`|
|Data constants   |UPPER_SNAKE_CASE|`RUNES`, `YT_CHANNEL`, `TABS` |
|Color constants  |C object        |`C.black`, `C.ember`          |
|localStorage keys|`hg_` prefix    |`hg_ideas`, `hg_journal`      |
|IPC channel names|`hg:` prefix    |`hg:readState`, `hg:saveImage`|

-----

## Testing

Tests live in `src/HaroldGrayblood.test.jsx`. The current suite is a smoke test (renders without crashing). When adding tests:

- Use `vitest` + `@testing-library/react`
- `window.matchMedia` is already mocked in `test-setup.js`
- `window.hgStorage` (Electron IPC) will need to be mocked for any tests involving persistence
- Run: `npm run test`

-----

## Development Workflows

### Browser-Only Dev (no Electron)

```bash
npm run dev
# Open http://localhost:5173
```

Electron-specific features (`window.hgStorage`) will be `undefined` — the app gracefully falls back to localStorage-only mode.

### Full Electron Dev

```bash
npm run electron:dev
```

This sets `VITE_DEV_SERVER_URL=http://localhost:5173` and launches Electron pointed at the dev server.

### Production Build

```bash
npm run electron:build
# Output: release/ (Windows NSIS installer)
```

Auto-update is configured for GitHub Releases under `burpleGod/YT-board-Immaculate`.

-----

## Important Constraints & Gotchas

1. **`HaroldGrayblood.jsx` must never be renamed.** The test imports it by name. The filename is permanent.
1. **Atomic Design refactor is approved.** Splitting into `atoms/`, `molecules/`, `organisms/`, `templates/`, and `pages/` is explicitly requested and in progress. Follow the phase plan above. Do not skip phases or merge phases without PM approval.
1. **`harold-grayblood-v3_4_1.jsx`** at the repo root is an archived snapshot for reference only. Never modify or import it.
1. **Images have two storage modes:**
- `data:image/...;base64,...` — used in browser/localStorage mode
- `hgdata://images/<id>` — used in Electron mode (files on disk)
- Code must handle both; check `src.startsWith("hgdata://")` where relevant.
1. **Theme settings are split into two localStorage keys** (`hg_theme_meta` and `hg_theme_images`) to avoid hitting storage size limits with large base64 image blobs.
1. **Tabs:** The app has 6 logical views: `skyrim`, `youtube`, `gallery`, `settings`, and two subtabs under skyrim (`ideas`, `journal`).
1. **electron-builder is Windows-only** in the current config (NSIS target). Do not assume cross-platform builds.
1. **No environment variables** are needed for development. The only env var is `VITE_DEV_SERVER_URL` set by the `electron:dev` script automatically.
1. **Context isolation is enabled** in Electron — renderer cannot access Node.js APIs directly. All native functionality goes through the `window.hgStorage` preload bridge.
1. **Plan before coding.** State what you’re changing and why before touching any file. Wait for PM approval.

-----

## Auto-Update Flow

1. On app start (production only), `autoUpdater.checkForUpdatesAndNotify()` runs.
1. When an update is ready, the main process sends `hg:updateReady` to the renderer.
1. The renderer shows an update notification banner.
1. User clicks “Install” → `window.hgStorage.installUpdate()` → `autoUpdater.quitAndInstall()`.
1. Releases must be published to GitHub under `burpleGod/YT-board-Immaculate` for updates to be detected.

-----

## Branch Strategy

|Branch          |Purpose                                          |
|----------------|-------------------------------------------------|
|`main`          |Stable, production-ready code                    |
|`Development`   |Active development — merge to main when stable   |
|Feature branches|One concern per branch, PR to main or Development|

**No force pushes to main.**