const {ipcMain, BrowserWindow, dialog} = require("electron");
const fs = require("fs");

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