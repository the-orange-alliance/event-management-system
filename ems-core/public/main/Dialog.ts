import {ipcMain, BrowserWindow, dialog, app, IpcMainEvent, FileFilter} from "electron";
import * as fs from "fs";
import * as url from "url";
import * as path from "path";
import logger from "./Logger";

const open = require("opn");

interface IOpenDialogProps {
  title?: string,
  files?: boolean,
  directories?: boolean,
  filters?: FileFilter[],
  parse?: boolean,
  sendData?: boolean
}

ipcMain.on("parse-csv", (event: IpcMainEvent, file: string) => {
  if (!file.endsWith(".csv")) {
    event.sender.send("parse-csv-response", "File does not end with a .csv extension.", null);
  }
  fs.readFile(file, (error, data) => {
    event.sender.send("parse-csv-response", error, data.toString().split("\n"));
  });
});

ipcMain.on("open-dialog", (event: IpcMainEvent, openProperties: IOpenDialogProps) => {
  // @ts-ignore - Unless there is another way to do this...
  dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    filters: openProperties.filters || [],
    // @ts-ignore - Unless there is another way to do this...
    properties: [(openProperties.files ? "openFile" : ""), openProperties.directories ? "openDirectory" : ""],
    title: openProperties.title || "Open Dialog"
  }, (paths: string[]) => {
    if (paths && paths[0]) {
      if (openProperties.sendData) {
        fs.readFile(paths[0], (err: any, data: any) => {
          event.sender.send("open-dialog-response", undefined, data);
        });
      } else {
        event.sender.send("open-dialog-response", undefined, paths);
      }
    } else {
      event.sender.send("open-dialog-response", "No file was selected.", null);
    }
  });
});

ipcMain.on("show-info", (event: IpcMainEvent, title: string, message: string) => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    message: message,
    title: title,
    type: "info",
  });
});

ipcMain.on("show-error", (event: IpcMainEvent, error: any) => {
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

ipcMain.on("generate-report", (event: any, reportHTML: any) => {
  const appDataPath = app.getPath("appData") + path.sep + app.getName();
  const cssCurPath = path.join(__dirname, "../../build/css/semantic.min.css");
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