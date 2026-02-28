const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const { autoUpdater } = require("electron-updater");

// Must be called before app is ready.
protocol.registerSchemesAsPrivileged([
  { scheme: "hgdata", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

const APP_DIR = "harold-grayblood";
const STATE_FILE = "state.json";
const IMAGES_DIR = "images";

let stateCache = null;

function getDataRoot() {
  return path.join(app.getPath("userData"), APP_DIR);
}

function getStatePath() {
  return path.join(getDataRoot(), STATE_FILE);
}

function getImagesPath() {
  return path.join(getDataRoot(), IMAGES_DIR);
}

async function ensureDataDirs() {
  await fsp.mkdir(getDataRoot(), { recursive: true });
  await fsp.mkdir(getImagesPath(), { recursive: true });
}

async function readStateFromDisk() {
  try {
    const raw = await fsp.readFile(getStatePath(), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeStateToDisk(next) {
  await ensureDataDirs();
  await fsp.writeFile(getStatePath(), JSON.stringify(next ?? null, null, 2), "utf-8");
}

function extFromMime(mime) {
  if (!mime) return ".bin";
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "image/svg+xml") return ".svg";
  return ".bin";
}

function sanitizeFileName(name) {
  if (!name) return "image";
  return String(name).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").slice(0, 120);
}

async function saveImageFile({ id, arrayBuffer, mime, originalName }) {
  await ensureDataDirs();
  const ext = extFromMime(mime);
  const safeBase = sanitizeFileName(originalName ? path.parse(originalName).name : "image");
  const fileName = `${String(id)}_${safeBase}${ext}`;
  const filePath = path.join(getImagesPath(), fileName);
  const buf = Buffer.from(arrayBuffer);
  await fsp.writeFile(filePath, buf);
  return { fileName };
}

async function deleteImageFilesById(id) {
  await ensureDataDirs();
  const idStr = String(id);
  const files = await fsp.readdir(getImagesPath()).catch(() => []);
  const toDelete = files.filter((f) => f.startsWith(idStr + "_") || f === idStr || f.startsWith(idStr + "."));
  await Promise.allSettled(toDelete.map((f) => fsp.unlink(path.join(getImagesPath(), f))));
}

function findImageFilePathByIdSync(id) {
  const idStr = String(id);
  try {
    const files = fs.readdirSync(getImagesPath());
    const hit = files.find((f) => f.startsWith(idStr + "_") || f === idStr || f.startsWith(idStr + "."));
    if (!hit) return null;
    return path.join(getImagesPath(), hit);
  } catch {
    return null;
  }
}

let mainWindow = null;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    backgroundColor: "#000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow = win;

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    await win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    await win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(async () => {
  await ensureDataDirs();

  stateCache = await readStateFromDisk();

  ipcMain.handle("hg:readState", async () => {
    if (stateCache === null) stateCache = await readStateFromDisk();
    return stateCache;
  });

  ipcMain.handle("hg:writeState", async (_evt, next) => {
    stateCache = next ?? null;
    await writeStateToDisk(stateCache);
    return true;
  });

  ipcMain.handle("hg:saveImage", async (_evt, payload) => {
    const { fileName } = await saveImageFile(payload);
    return { fileName };
  });

  ipcMain.handle("hg:deleteImage", async (_evt, payload) => {
    await deleteImageFilesById(payload?.id);
    return true;
  });

  protocol.registerFileProtocol("hgdata", (request, callback) => {
    try {
      const u = new URL(request.url);
      // hgdata://images/<id>
      if (u.hostname !== "images") return callback({ error: -6 });
      const id = decodeURIComponent(u.pathname.replace(/^\//, ""));
      const filePath = findImageFilePathByIdSync(id);
      if (!filePath) return callback({ error: -6 });
      return callback({ path: filePath });
    } catch {
      return callback({ error: -6 });
    }
  });

  ipcMain.handle("hg:readAllImages", async () => {
    await ensureDataDirs();
    const files = await fsp.readdir(getImagesPath()).catch(() => []);
    const result = {};
    for (const f of files) {
      const id = f.split("_")[0];
      const buf = await fsp.readFile(path.join(getImagesPath(), f));
      const ext = path.extname(f).toLowerCase();
      const mime = { ".png":"image/png", ".jpg":"image/jpeg", ".webp":"image/webp", ".gif":"image/gif", ".svg":"image/svg+xml" }[ext] || "application/octet-stream";
      result[id] = `data:${mime};base64,${buf.toString("base64")}`;
    }
    return result;
  });

  ipcMain.handle("hg:getVersion", () => app.getVersion());

  ipcMain.handle("hg:installUpdate", () => {
    autoUpdater.quitAndInstall();
  });

  await createWindow();

  // Auto-updater (only in production builds)
  if (!process.env.VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.on("update-downloaded", () => {
      if (mainWindow) {
        mainWindow.webContents.send("hg:updateReady");
      }
    });
  }

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
