import {app, ipcMain, BrowserWindow} from "electron";
import * as url from "url";
import * as path from "path";
import logger from "./main/Logger";

require("dotenv").config({path: path.join(__dirname, ".env")});

const prod: boolean = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

if (!prod || true) { // todo: disable debug in production
  require("electron-debug")({showDevTools: true, enabled: true});
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

function createWindow () {
  // Create the splash screen window.
  let splashWin: Electron.BrowserWindow = new BrowserWindow({width: 480, height: 360, frame: false, show: false});
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
  win = new BrowserWindow({
    height: 720,
    minHeight: 600,
    minWidth: 900,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 1280
  });
  if (prod) {
    require("./main/Services");
    require("./main/ConfigStores");
    require("./main/Dialog");
    require("./main/Matchmaker");

    logger.transports[0].level = "debug";
    logger.info("------------STARTING EMS IN PRODUCTION MODE------------");
    win.loadURL(url.format({
      pathname: path.join(__dirname, "./index.html"),
      protocol: "file:",
      slashes: true
    }));
  } else {
    require("./main/Services");
    require("./main/ConfigStores");
    require("./main/Dialog");
    require("./main/Matchmaker");

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

const lock = app.requestSingleInstanceLock();

if (!lock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
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
