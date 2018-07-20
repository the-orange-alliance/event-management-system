import {FileFilter} from "electron";
import AppError from "../models/AppError";
import HttpError from "../models/HttpError";

interface IOpenDialogProps {
  title?: string,
  files?: boolean,
  directories?: boolean
  filters?: FileFilter[],
  parse?: boolean
}

const ipcRenderer = (window as any).require("electron").ipcRenderer;

class DialogManager {
  private static _instance: DialogManager;

  public static getInstance(): DialogManager {
    if (typeof DialogManager._instance === "undefined") {
      DialogManager._instance = new DialogManager();
    }
    return DialogManager._instance;
  }

  private constructor() {}

  public parseCSV(file: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      ipcRenderer.once("parse-csv-success", (event: any, lines: string[]) => {
        resolve(lines);
      });
      ipcRenderer.once("parse-csv-error", (event: any, error: any) => {
        reject(new AppError(1200, "CSV_PARSE", error));
      });
      ipcRenderer.send("parse-csv", file);
    });
  }

  public showOpenDialog(props?: IOpenDialogProps): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      ipcRenderer.once("open-dialog-success", (event: any, paths: string[]) => {
        resolve(paths);
      });
      ipcRenderer.once("open-dialog-error", (event: any, error: any) => {
        reject(new AppError(1201, "DIALOG_OPEN", error));
      });
      ipcRenderer.send("open-dialog", props);
    });
  }

  public showInfoBox(title: string, message: string) {
    ipcRenderer.send("show-info", title, message);
  }

  public showErrorBox(error: AppError | HttpError) {
    ipcRenderer.send("show-error", error);
  }
}

export default DialogManager.getInstance();