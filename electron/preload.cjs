const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("hgStorage", {
  readState: () => ipcRenderer.invoke("hg:readState"),
  writeState: (state) => ipcRenderer.invoke("hg:writeState", state),
  saveImage: (id, arrayBuffer, mime, originalName) =>
    ipcRenderer.invoke("hg:saveImage", { id, arrayBuffer, mime, originalName }),
  deleteImage: (id) => ipcRenderer.invoke("hg:deleteImage", { id }),
  readAllImages: () => ipcRenderer.invoke("hg:readAllImages"),
  getVersion: () => ipcRenderer.invoke("hg:getVersion"),
  installUpdate: () => ipcRenderer.invoke("hg:installUpdate"),
  onUpdateReady: (callback) => {
    ipcRenderer.on("hg:updateReady", () => callback());
  },
});
