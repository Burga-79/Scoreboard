const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

// Start the local upload server
require("./server");

let adminWindow;
let displayWindow;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();

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
      preload: path.join(__dirname, "preload.js")
    }
  });

  adminWindow.loadFile("admin/admin.html");

  //
  // DISPLAY WINDOW (TV)
  //
  displayWindow = new BrowserWindow({
    width: external ? external.size.width : primary.size.width,
    height: external ? external.size.height : primary.size.height,
    x: external ? external.bounds.x : 0,
    y: external ? external.bounds.y : 0,
    frame: false,          // No borders
    fullscreen: true,      // Fullscreen on the TV
    title: "Scoreboard Display",
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  displayWindow.loadFile("display/display.html");

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
