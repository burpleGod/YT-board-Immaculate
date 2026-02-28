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

---

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

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18.3 (functional components + hooks) |
| Build Tool | Vite 5.4 |
| Desktop Shell | Electron 37 |
| Testing | Vitest 2.1 + @testing-library/react + jsdom |
| Packaging | electron-builder (NSIS installer for Windows) |
| Auto-Update | electron-updater → GitHub Releases |
| Fonts | @fontsource packages (Cinzel, Kalam, EB Garamond, Crimson Text) |
| Styling | Inline CSS-in-JS (no CSS files, no CSS framework) |
| State | React hooks (useState/useEffect/useRef) — no Redux/Zustand |
| Persistence | Browser localStorage + Electron filesystem (IPC) |

---

## Key Scripts

```bash
npm run dev              # Vite dev server (browser preview, hot reload)
npm run electron:dev     # Full Electron app in dev mode
npm run build            # Vite production build
npm run electron:build   # Full Windows NSIS installer build
npm run test             # Vitest test suite (run once)
npm run preview          # Preview the Vite production build
```

---

## Architecture Deep-Dive

### Single-Component Pattern

All page components (`SkyrimPage`, `IdeasPage`, `JournalPage`, `YouTubePage`, `GalleryPage`, `SettingsPage`) and all helper functions are defined **inside `src/HaroldGrayblood.jsx`**. This is intentional — do not split into separate files unless explicitly asked.

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

| Key | Contents |
|---|---|
| `hg_ideas` | Ideas array |
| `hg_journal` | Journal entries array |
| `hg_episodes` | Episodes array |
| `hg_categories` | Custom idea categories |
| `hg_gallery` | Gallery image metadata |
| `hg_gallery_categories` | Gallery category names |
| `hg_theme_meta` | Theme settings (no images) |
| `hg_theme_images` | Theme background images (base64, stored separately due to size) |

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

---

## Styling Conventions

### Color System

All colors are defined in the `C` object at the top of `HaroldGrayblood.jsx`:

```js
C.black, C.ember, C.gold, C.ash, C.fog, ...
```

Always use `C.<name>` for colors — never hardcode hex values inline.

### Style Helpers

Reusable style factories defined in `HaroldGrayblood.jsx`:

- `themedInput(theme)` — styled input/textarea
- `ghostBtnStyle(theme)` — transparent button
- `accentBtnStyle(theme)` — accent-colored button

### Animation

CSS `@keyframes` are injected via a `<style>` element in `main.jsx` or the global scope. Common keyframes:

- `fadeUp`, `slideIn`, `popIn`, `tabEnter`, `calEnter`, `runeGlow`, `fogDrift`, `starTwinkle`

Trigger animations by setting `style.animation` or toggling a `className`.

### No CSS Files

There are **no `.css` files**. All styles are inline objects or injected `<style>` tags. This is a deliberate constraint — do not introduce CSS files or CSS modules.

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `HaroldGrayblood`, `IdeasPage` |
| Helper functions | camelCase | `hexToRgb`, `sanitizeFileName` |
| Data constants | UPPER_SNAKE_CASE | `RUNES`, `YT_CHANNEL`, `TABS` |
| Color constants | C object | `C.black`, `C.ember` |
| localStorage keys | `hg_` prefix | `hg_ideas`, `hg_journal` |
| IPC channel names | `hg:` prefix | `hg:readState`, `hg:saveImage` |

---

## Testing

Tests live in `src/HaroldGrayblood.test.jsx`. The current suite is a smoke test (renders without crashing). When adding tests:

- Use `vitest` + `@testing-library/react`
- `window.matchMedia` is already mocked in `test-setup.js`
- `window.hgStorage` (Electron IPC) will need to be mocked for any tests involving persistence
- Run: `npm run test`

---

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

This sets `VITE_DEV_SERVER_URL=http://localhost:5173` and launches Electron pointed at the dev server. Requires Vite dev server to be running (the script starts both).

### Production Build

```bash
npm run electron:build
# Output: release/ (Windows NSIS installer)
```

Auto-update is configured for GitHub Releases under `burpleGod/YT-board-Immaculate`.

---

## Important Constraints & Gotchas

1. **Do not split `HaroldGrayblood.jsx`** into smaller files unless explicitly requested. The monolithic pattern is intentional.

2. **`harold-grayblood-v3_4_1.jsx`** at the repo root is an archived snapshot for reference only. Never modify or import it.

3. **Images have two storage modes:**
   - `data:image/...;base64,...` — used in browser/localStorage mode
   - `hgdata://images/<id>` — used in Electron mode (files on disk)
   - Code must handle both; check `src.startsWith("hgdata://")` where relevant.

4. **Theme settings are split into two localStorage keys** (`hg_theme_meta` and `hg_theme_images`) to avoid hitting storage size limits with large base64 image blobs.

5. **Tabs:** The app has 6 logical views mapped to `TABS` constants: `skyrim`, `youtube`, `gallery`, `settings`, and two subtabs under skyrim (`ideas`, `journal`).

6. **electron-builder is Windows-only** in the current config (NSIS target). Do not assume cross-platform builds.

7. **No environment variables** are needed for development. The only env var is `VITE_DEV_SERVER_URL` set by the `electron:dev` script automatically.

8. **Context isolation is enabled** in Electron — renderer cannot access Node.js APIs directly. All native functionality goes through the `window.hgStorage` preload bridge.

---

## Auto-Update Flow

1. On app start (production only), `autoUpdater.checkForUpdatesAndNotify()` runs.
2. When an update is ready, the main process sends `hg:updateReady` to the renderer.
3. The renderer shows an update notification banner.
4. User clicks "Install" → `window.hgStorage.installUpdate()` → `autoUpdater.quitAndInstall()`.
5. Releases must be published to GitHub under `burpleGod/YT-board-Immaculate` for updates to be detected.
