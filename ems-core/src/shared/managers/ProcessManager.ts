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
      ipcRenderer.once("list-ecosystem-success", (event: any, procList: any) => {
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
      ipcRenderer.once("start-ecosystem-success", (event: any, procList: any, host: string) => {
        const proc1 = Process.fromPM2(procList[0][0], host);
        const proc2 = Process.fromPM2(procList[1][0], host);
        const proc3 = Process.fromPM2(procList[2][0], host);
        const processes: Process[] = [proc1, proc2, proc3];
        resolve(processes);
      });
      ipcRenderer.once("start-ecosystem-error", (procList: Process[]) => {
        reject();
      });
      ipcRenderer.send("start-ecosystem", newHost);
    });
  }
}

export default ProcessManager.getInstance();