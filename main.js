const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

// Start Express server
require("./server");

let adminWindow;
let displayWindow;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();

  // Correct paths
  const appPath = app.getAppPath();            // inside app.asar
  const resourcesPath = process.resourcesPath; // outside ASAR (images)

  const external = displays.find(d => d.id !== primary.id);

  // ADMIN WINDOW
  adminWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Scoreboard Admin",
    webPreferences: {
      preload: path.join(appPath, "preload.js")
    }
  });

  adminWindow.loadFile(path.join(appPath, "admin", "admin.html"));

  // DISPLAY WINDOW
  displayWindow = new BrowserWindow({
    width: external ? external.size.width : primary.size.width,
    height: external ? external.size.height : primary.size.height,
    x: external ? external.bounds.x : 0,
    y: external ? external.bounds.y : 0,
    frame: false,
    fullscreen: true,
    title: "Scoreboard Display",
    webPreferences: {
      preload: path.join(appPath, "preload.js")
    }
  });

  displayWindow.loadFile(path.join(appPath, "display", "display.html"));

  // IPC: Reload display
  ipcMain.on("reload-display", () => {
    if (displayWindow) displayWindow.reload();
  });
}

app.whenReady().then(() => {
  createWindows();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
