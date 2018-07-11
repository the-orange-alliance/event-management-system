import Process from "../models/Process";

const ipcRenderer = (window as any).require("electron").ipcRenderer;

class ProcessManager {
  private static _instance: ProcessManager;

  private constructor() {}

  public static getInstance() {
    if (!ProcessManager._instance) {
      ProcessManager._instance = new ProcessManager();
    }
    return ProcessManager._instance;
  }

  public listEcosystem(): Promise<Process[]> {
    return new Promise<Process[]>((resolve, reject) => {
      ipcRenderer.once("list-ecosystem-success", (procList: Process[]) => {
        resolve(procList);
      });
      ipcRenderer.once("list-ecosystem-error", (procList: Process[]) => {
        reject();
      });
      ipcRenderer.send("list-ecosystem");
    });
  }

  public startEcosystem(newHost?: string): Promise<Process[]> {
    return new Promise<Process[]>((resolve, reject) => {
      ipcRenderer.once("start-ecosystem-success", (procList: Process[]) => {
        resolve(procList);
      });
      ipcRenderer.once("start-ecosystem-error", (procList: Process[]) => {
        reject();
      });
      ipcRenderer.send("start-ecosystem", newHost);
    });
  }
}

export default ProcessManager.getInstance();