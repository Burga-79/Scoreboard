const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

// Start the local upload server
require("./server");

let adminWindow;
let displayWindow;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();

  // Detect packaged vs development
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  // Try to find a second monitor (TV)
  const external = displays.find(d => d.id !== primary.id);

  //
  // ADMIN WINDOW (Laptop)
  //
  adminWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Scoreboard Admin",
    webPreferences: {
      preload: path.join(basePath, "preload.js")
    }
  });

  adminWindow.loadFile(path.join(basePath, "admin/admin.html"));

  //
  // DISPLAY WINDOW (TV)
  //
  displayWindow = new BrowserWindow({
    width: external ? external.size.width : primary.size.width,
    height: external ? external.size.height : primary.size.height,
    x: external ? external.bounds.x : 0,
    y: external ? external.bounds.y : 0,
    frame: false,
    fullscreen: true,
    title: "Scoreboard Display",
    webPreferences: {
      preload: path.join(basePath, "preload.js")
    }
  });

  displayWindow.loadFile(path.join(basePath, "display/display.html"));

  //
  // LISTEN FOR RELOAD REQUEST FROM ADMIN
  //
  ipcMain.on("reload-display", () => {
    if (displayWindow) {
      displayWindow.reload();
    }
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
