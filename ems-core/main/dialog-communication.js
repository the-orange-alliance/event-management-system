const {ipcMain, BrowserWindow, dialog, app} = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const open = require("open");
const logger = require("./logger");

ipcMain.on("parse-csv", (event, file) => {
  if (!file.endsWith(".csv")) {
    event.sender.send("parse-csv-error", "File does not end with a .csv extension.");
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      event.sender.send("parse-csv-error", error);
    } else {
      event.sender.send("parse-csv-success", data.toString().split("\n"));
    }
  });
});

ipcMain.on("open-dialog", (event, openProperties) => {
  dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    filters: openProperties.filters || [],
    properties: [openProperties.files ? "openFile" : "", openProperties.directories ? "openDirectory" : ""],
    title: openProperties.title || "Open Dialog"
  }, (paths) => {
    if (paths && paths[0]) {
      event.sender.send("open-dialog-success", paths);
    } else {
      event.sender.send("open-dialog-error", "No file was selected.");
    }
  });
});

ipcMain.on("show-info", (event, title, message) => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    detail: message,
    title: title,
    type: "info",
  });
});

ipcMain.on("show-error", (event, error) => {
  if (error._stacktrace) {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      message: "There was an error while trying to complete a vital operation. Error code " + error._errorCode + " (" + error._errorMessage + "). Stacktrace: " + error._stacktrace +
      ". If you don't understand how to fix this error, contact the application staff for support.",
      title: "System Application Error " + error._errorCode,
      type: "error"
    });
  } else {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      message: "There was an error while trying to complete a vital operation. Error code " + error._httpCode + ": " + error._errorStr + " accessing " + error._message +
      ". If you don't understand how to fix this error, contact the application staff for support.",
      title: "System HTTP Error " + error._httpCode,
      type: "error"
    });
  }
});

ipcMain.on("generate-report", (event, reportHTML) => {
  const appDataPath = app.getPath("appData") + path.sep + app.getName();
  const cssCurPath = path.join(__dirname, "../build/css/semantic.min.css");
  const reportPath = path.join(appDataPath, "report.html");
  const cssCpyPath = path.join(appDataPath, "semantic.min.css");
  fs.writeFile(reportPath, reportHTML, (writeErr) => {
    if (writeErr) {
      logger.error(writeErr);
    } else {
      fs.copyFile(cssCurPath, cssCpyPath, (err) => {
        if (err) {
          logger.error(err);
        } else {
          logger.debug("Successfully generated report.")
        }
      });
    }
  });
});

ipcMain.on("print-report", () => {
  const appDataPath = app.getPath("appData") + path.sep + app.getName();
  const reportPath = path.join(appDataPath, "report.html");
  let printWindow = new BrowserWindow({
    center: true,
    parent: BrowserWindow.getFocusedWindow()
  });
  printWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => {
      printWindow.webContents.print();
    }, 1000);
  });
  printWindow.on("close", () => {
    printWindow = null;
  });
  printWindow.loadURL(url.format({
    pathname: reportPath,
    protocol: "file:",
    slashes: true
  }));
  printWindow.setMenu(null);
});

ipcMain.on("view-report", () => {
  const appDataPath = app.getPath("appData") + path.sep + app.getName();
  const reportPath = path.join(appDataPath, "report.html");
  open(reportPath);
});