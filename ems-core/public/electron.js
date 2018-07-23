const {app, ipcMain, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

require("dotenv").config({path: path.join(__dirname, ".env")});

const prod = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

if (!prod) {
  require("electron-debug")({showDevTools: true, enabled: true});
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the splash screen window.
  let splashWin = new BrowserWindow({width: 480, height: 360, alwaysOnTop: true, frame: false, show: false});
  splashWin.loadURL(url.format({
    pathname: path.join(__dirname, "./splash.html"),
    protocol: "file:",
    slashes: true
  }));

  splashWin.webContents.on("did-finish-load", () => {
    splashWin.show();
  });

  splashWin.setMenu(null);

  ipcMain.on("preload-finish", () => {
    if (splashWin !== null) {
      splashWin.destroy();
      splashWin = null;
    }
    win.maximize();
    win.show();
  });

  // Create the browser window.
  win = new BrowserWindow({width: 1280, height: 720, minHeight: 600, minWidth: 900, show: false});
  if (prod) {
    const logger = require("./main/logger");
    require("./main/process-communication");
    require("./main/store-communication");
    require("./main/dialog-communication");
    require("./main/matchmaker-communication");

    logger.transports[0].level = "debug";
    logger.info("------------STARTING EMS IN PRODUCTION MODE------------");
    win.loadURL(url.format({
      pathname: path.join(__dirname, "./index.html"),
      protocol: "file:",
      resizable: false,
      slashes: true
    }));
  } else {
    const logger = require("../main/logger");
    require("../main/process-communication");
    require("../main/store-communication");
    require("../main/dialog-communication");
    require("../main/matchmaker-communication");

    logger.transports[0].level = "debug";
    logger.info("------------STARTING EMS IN DEVELOPMENT MODE------------");
    win.loadURL("http://localhost:3000/");
  }

  win.setMenu(null);

  // Emitted when the window is closed.
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});