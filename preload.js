const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("scoreboardAPI", {
  reloadDisplay: () => ipcRenderer.send("reload-display")
});
