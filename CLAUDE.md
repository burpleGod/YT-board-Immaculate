# CLAUDE.md — AI Assistant Guide for Harold Grayblood

## Project Overview

**Harold Grayblood** is a cross-platform Electron + React desktop dashboard built for YouTube content creators, specifically Skyrim/fantasy roleplay creators. It provides:

- **YouTube Pipeline** — episode production tracking (planned → scripted → recorded → edited → uploaded)
- **Idea Ledger** — categorized notes and ideas board
- **Roleplay Journal** — rich-text diary with per-entry font/size/alignment formatting
- **Gallery** — image management with captions, tags, and categories
- **The Forge** — per-tab UI customizer (backgrounds, accent colors, overlays, slideshows)
- **Auto-updater** — GitHub Releases integration via electron-updater

The codebase follows an **Atomic Design architecture** — Phase 3 refactor is complete. `src/HaroldGrayblood.jsx` is the root component only (~128 lines); all page and UI logic lives in `src/atoms/`, `src/molecules/`, `src/organisms/`, `src/templates/`, and `src/pages/`.

-----

## Repository Structure

```
YT-board-Immaculate/
├── index.html                      # Vite HTML entry point
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite + Vitest configuration
├── src/
│   ├── main.jsx                    # React DOM entry (renders HaroldGrayblood)
│   ├── HaroldGrayblood.jsx         # ROOT ONLY — state, effects, routing (~128 lines)
│   ├── HaroldGrayblood.test.jsx    # Smoke tests
│   ├── test-setup.js               # Vitest setup (jest-dom + matchMedia mock)
│   ├── constants.js                # C, TABS, TAB_LABELS, RUNES, STATUS_COLORS, etc.
│   ├── utils.js                    # hexToRgb, loadState, saveState, style helpers
│   ├── atoms/
│   │   ├── Button.jsx              # FilterBtn, ActionBtn, ToggleBtn
│   │   ├── Label.jsx               # FieldLabel
│   │   ├── EmptyState.jsx
│   │   └── Tag.jsx
│   ├── molecules/
│   │   ├── Nav.jsx
│   │   ├── PageHeader.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── FilterBar.jsx
│   │   └── CategoryManager.jsx
│   ├── organisms/
│   │   ├── IdeaCard.jsx
│   │   ├── JournalEntryRow.jsx
│   │   ├── JournalEntryForm.jsx
│   │   ├── FullscreenJournal.jsx
│   │   ├── EpisodeRow.jsx
│   │   ├── EpisodeCard.jsx
│   │   ├── EpisodeForm.jsx
│   │   ├── GalleryCard.jsx
│   │   ├── ParchmentView.jsx
│   │   ├── YouTubeCalendar.jsx
│   │   └── ChannelBanner.jsx
│   ├── templates/
│   │   ├── PageShell.jsx
│   │   ├── Box.jsx
│   │   ├── TabBackground.jsx
│   │   └── TwoColumnLayout.jsx
│   └── pages/
│       ├── SkyrimPage.jsx
│       ├── IdeasPage.jsx
│       ├── JournalPage.jsx
│       ├── YouTubePage.jsx
│       ├── GalleryPage.jsx
│       └── SettingsPage.jsx
├── electron/
│   ├── main.cjs                    # Electron main process (~200 lines)
│   └── preload.cjs                 # Context-bridge IPC preload (~15 lines)
├── docs/
│   └── patterns/
│       └── atomic-design-extraction.md
├── harold-grayblood-v3_4_1.jsx     # Archive/reference snapshot — do not edit
└── README.md
```

-----

## Source of Truth Registry

| Resource | Path |
|----------|------|
| **Primary Source** | `C:\Users\malon\Documents\ClaudeCode\YT-board-Immaculate\src\HaroldGrayblood.jsx` |
| **Fallback** | `https://raw.githubusercontent.com/burpleGod/YT-board-Immaculate/refs/heads/main/src/HaroldGrayblood.jsx` |
| **Electron Main** | `electron/main.cjs` |
| **Electron Preload** | `electron/preload.cjs` |
| **Context Pointer** | `CONTEXT.md` (max 15 lines, no data) |
| **Agent Instructions** | `CLAUDE.md` (this file) |

> Always verify source files exist at the primary path before planning. Fall back to the GitHub raw URL only if the local file is unavailable.

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

### Atomic Design Pattern

All page components (`SkyrimPage`, `IdeasPage`, `JournalPage`, `YouTubePage`, `GalleryPage`, `SettingsPage`) live in `src/pages/`. UI primitives are in `src/atoms/`, `src/molecules/`, `src/organisms/`, and `src/templates/`. Constants and utilities are in `src/constants.js` and `src/utils.js`. `src/HaroldGrayblood.jsx` contains only state, effects, and the root render.

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
window.hgStorage.readState()                   // → Promise<object>
window.hgStorage.writeState(state)             // → Promise<void>
window.hgStorage.saveImage(id, base64)         // → Promise<void>
window.hgStorage.deleteImage(id)               // → Promise<void>
window.hgStorage.readAllImages()               // → Promise<{ id: string, data: string }[]>
window.hgStorage.getVersion()                  // → Promise<string>
window.hgStorage.installUpdate()               // → void
window.hgStorage.readProfiles()                // → Promise<{ activeProfileId, profiles[] } | null>
window.hgStorage.writeProfiles(data)           // → Promise<boolean>
window.hgStorage.setActiveProfile(profileId)   // → Promise<{ ok: true } | { error: string }>
window.hgStorage.createProfile(data)           // → Promise<{ ok: true, profile: object }>
```

**Custom protocol:** `hgdata://images/<id>` serves image files from the Electron userData directory.

**File storage path:** `%ProgramData%\HaroldGrayblood\{profile-id}\` (profile-aware since Phase 4B). Profiles listed in `%ProgramData%\HaroldGrayblood\hg-profiles.json`.

- `state.json` — serialized application state
- `images/` — binary image files

-----

## Atomic Design Refactor — Complete

**Status:** ✅ All phases complete (2026-03-11). `HaroldGrayblood.jsx` is now ~128 lines — root state, effects, and render only.

The monolithic refactor into Atomic Design is finished. This was a structural refactor only — no visual changes, no behavioral changes, no new dependencies.

### Refactor Phase Plan

|Phase|Task                                                              |Status   |
|-----|------------------------------------------------------------------|---------|
|A    |Extract constants.js + utils.js. Fix `hexToRgb()` for rgba inputs.|✅ Done   |
|B    |Extract atoms/                                                    |✅ Done   |
|C    |Extract molecules/                                                |✅ Done   |
|D    |Extract organisms/ (commit per organism)                          |✅ Done   |
|E    |Extract templates/ + pages/                                       |✅ Done   |

### Refactor Rules (preserved for Phase 4+ reference)

- `npm test` must pass (1/1) after every phase before proceeding
- `HaroldGrayblood.jsx` filename must never change
- Inline styles preserved — no CSS files, no Tailwind (until Phase 4)
- No visual or behavioral changes during Phase 3
- `hexToRgb()` fixed for rgba inputs in Phase A

-----

## Styling Conventions

### Color System

All colors are defined in the `C` object in `src/constants.js`:

```js
C.black, C.ember, C.gold, C.ash, C.fog, ...
```

Always use `C.<n>` for colors — never hardcode hex values inline.

### Style Helpers

Reusable style factories defined in `src/utils.js`:

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

## Plan Mode (Default)

**Plan Mode is the default for all Claude Code agent sessions on this project** (locked decision: 2026-03-02, PM: Sarah).

Before executing any task:
1. Read current source files
2. Write a plan to the plan file
3. Wait for explicit PM approval
4. Execute only after approval

Do not write code speculatively. Do not skip planning for "small" changes. When in doubt, stop and ask Sarah.

-----

## Important Constraints & Gotchas

1. **`HaroldGrayblood.jsx` must never be renamed.** The test imports it by name. The filename is permanent.
1. **Atomic Design refactor is complete.** All layers — `atoms/`, `molecules/`, `organisms/`, `templates/`, and `pages/` — are extracted. `HaroldGrayblood.jsx` is root-only (~128 lines). Next structural work begins in Phase 4.
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

## Team Roles & Delegation

Tag specialists using `@[role] request: [description]`. Do not begin blocked phases until the owner answers the open question.

| Role | Owner | Domain | Current Blocker |
|------|-------|--------|-----------------|
| **PM** | Sarah | Approvals, task assignment | Blocks Phase 6: Launch model |
| **Full Stack** | Karina | Implementation, data layer, onboarding | — |
| **UI/UX** | — | Visuals, Atomic Design, shadcn migration | Blocks Phase 5A: shadcn install scope |
| **QA** | — | Test coverage, accessibility pass | — |
| **Backend** | — | Storage strategy, IPC layer, MCP server | Blocks Phase 4C: Profile import format |
| **Security** | — | Input validation, XSS, audits | — |
| **DevOps** | Mylo | Pipeline, releases, plugins | Blocks Phase 4B: Launcher vs single installer |
| **Narrative** | Leonard | In-world copy, Harold vocabulary | — |

-----

## Compound Engineering (Mandatory)

After every work unit, update documentation before closing the task. Do not skip this step.

- **`docs/solutions/`** — Document bugs, root causes, and fixes.
- **`docs/patterns/`** — Document newly discovered or established patterns.
- **`docs/decisions/`** — Log locked architectural decisions (include Date and Owner).

-----

## Branch Strategy

|Branch          |Purpose                                          |
|----------------|-------------------------------------------------|
|`main`          |Stable, production-ready code                    |
|`Development`   |Active development — merge to main when stable   |
|Feature branches|One concern per branch, PR to main or Development|

**No force pushes to main.**