import {ipcMain, app, IpcMessageEvent} from "electron";
import * as path from "path";
import * as fs from "fs";
import logger from "./Logger";
const appDataPath = app.getPath("userData");

logger.info("Using application data path " + appDataPath);

interface IConfigOptions {
  key?: string,
  data: any,
  file: string
}

ipcMain.on("store-set-all", (event: IpcMessageEvent, config: IConfigOptions) => {
  const filePath = path.join(appDataPath, config.file);
  fs.writeFile(filePath, JSON.stringify(config.data), (err) => {
    if (err) {
      logger.error(err);
    }
    event.sender.send("store-set-all-response", err, config.data);
  });
});

ipcMain.on("store-get-all", (event: IpcMessageEvent, file: string) => {
  const filePath = path.join(appDataPath, file);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error(err);
      event.sender.send("store-get-all-response", err, undefined);
    } else {
      event.sender.send("store-get-all-response", err, JSON.parse(data.toString()));
    }
  });
});

ipcMain.on("store-set", (event: IpcMessageEvent, config: IConfigOptions) => {
  const filePath = path.join(appDataPath, config.file);
  fs.readFile(filePath, (readErr, data) => {
    if (readErr) {
      logger.error(readErr);
      event.sender.send("store-set-response", readErr, null);
    } else {
      const storeJSON = JSON.parse(data.toString());
      if (typeof storeJSON[config.key] === "undefined") {
        storeJSON[config.key] = {};
      }
      storeJSON[config.key] = config.data;
      fs.writeFile(filePath, JSON.stringify(storeJSON), (writeErr) => {
        if (writeErr) {
          logger.error(writeErr);
        }
        event.sender.send("store-set-response", writeErr, storeJSON);
      });
    }
  });
});

ipcMain.on("create-backup", (event: IpcMessageEvent, backupDir: string, filename: string) => {
  if (typeof backupDir !== "undefined" && backupDir.length > 0) {
    try {
      const dbFile = path.join(appDataPath, "production.db");
      const destFile = path.join(backupDir,  filename + "_production.db");
      fs.copyFile(dbFile, destFile, (error) => {
        if (error) {
          logger.error(error);
        }
        event.sender.send("create-backup-response", error, null);
      });
    } catch (e) {
      logger.error(e);
      event.sender.send("create-backup-response", "Error while attempting to create a backup.", null);
    }
  } else {
    event.sender.send("create-backup-response", "Backup location is not correctly set.", null);
  }
});

ipcMain.on("check-existance", (event: IpcMessageEvent, filename: string) => {
  fs.open(path.join(appDataPath, filename), 'r', (err, file) => {
    if (err) {
      logger.error(err);
      fs.writeFileSync(path.join(appDataPath, filename), "{}");
    }
    event.returnValue = err ? false : true;
  });
});