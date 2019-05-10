import {FileFilter} from "electron";
import {AppError, HttpError} from "@the-orange-alliance/lib-ems";

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
      ipcRenderer.once("parse-csv-response", (event: any, error: any, lines: string[]) => {
        if (error) {
          reject(new AppError(1200, "CSV_PARSE", error));
        } else {
          resolve(lines);
        }
      });
      ipcRenderer.send("parse-csv", file);
    });
  }

  public showOpenDialog(props?: IOpenDialogProps): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      ipcRenderer.once("open-dialog-response", (event: any, error: any, paths: string[]) => {
        if (error) {
          reject(new AppError(1201, "DIALOG_OPEN", error));
        } else {
          resolve(paths);
        }
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

  public generateReport(html: string) {
    ipcRenderer.send("generate-report", html);
  }

  public viewReport() {
    ipcRenderer.send("view-report");
  }

  public printReport() {
    ipcRenderer.send("print-report");
  }
}

export default DialogManager.getInstance();