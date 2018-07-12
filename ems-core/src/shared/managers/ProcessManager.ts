import Process from "../models/Process";
import AppError from "../models/AppError";

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

  public performStartupCheck(): Promise<Process[]> {
    return new Promise<Process[]>((resolve, reject) => {
      this.listEcosystem().then((currentProc: Process[]) => {
        if (currentProc.length <= 0) {
          this.startEcosystem().then((startedProc: Process[]) => {
            resolve(startedProc);
          }).catch((error: AppError) => {
            reject(error);
          });
        } else {
          resolve(currentProc);
        }
      }).catch((error: AppError) => {
        reject(error);
      });
    });
  }

  public listEcosystem(): Promise<Process[]> {
    return new Promise<Process[]>((resolve, reject) => {
      ipcRenderer.once("list-ecosystem-success", (event: any, procList: any) => {
        const processes: Process[] = [];
        if (procList.length === 3) {
          processes.push(Process.fromPM2(procList[0]));
          processes.push(Process.fromPM2(procList[1]));
          processes.push(Process.fromPM2(procList[2]));
        }
        resolve(processes);
      });
      ipcRenderer.once("list-ecosystem-error", (error: any) => {
        reject(new AppError(1013, "PM2_LIST", error));
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
      ipcRenderer.once("start-ecosystem-error", (error: any) => {
        reject(new AppError(1010, "PM2_START", error));
      });
      ipcRenderer.send("start-ecosystem", newHost);
    });
  }

  public startProcess(process: Process, host?: string): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("start-process-success", (event: any, startedProcess: any) => {
        if (typeof startedProcess[0] === "undefined") {
          process.status = "error";
        } else {
          process.status = startedProcess[0].pm2_env.status;
        }
        resolve(process);
      });
      ipcRenderer.once("start-process-error", (error: any) => {
        reject(new AppError(1000, "PM2_START", error));
      });
      ipcRenderer.send("start-process", process.name, host);
    });
  }

  public stopProcess(process: Process): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("stop-process-success", (event: any, stoppedProcess: any) => {
        if (typeof stoppedProcess[0] === "undefined") {
          process.status = "error";
        } else {
          process.status = stoppedProcess[0].pm2_env.status;
        }
        resolve(process);
      });
      ipcRenderer.once("stop-process-error", (error: any) => {
        reject(new AppError(1001, "PM2_STOP", error));
      });
      ipcRenderer.send("stop-process", process.name);
    });
  }

  public restartProcess(process: Process): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("restart-process-success", (event: any, restartedProcess: any) => {
        if (typeof restartedProcess[0] === "undefined") {
          process.status = "error";
        } else {
          process.status = restartedProcess[0].pm2_env.status;
        }
        resolve(process);
      });
      ipcRenderer.once("restart-process-error", (error: any) => {
        reject(new AppError(1002, "PM2_RESTART", error));
      });
      ipcRenderer.send("restart-process", process.name);
    });
  }
}

export default ProcessManager.getInstance();