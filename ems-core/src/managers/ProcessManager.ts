import {AppError, Process} from "@the-orange-alliance/lib-ems";

const ipcRenderer = (window as any).require("electron").ipcRenderer;

class ProcessManager {
  private static _instance: ProcessManager;

  private constructor() {}

  public static getInstance() {
    if (typeof ProcessManager._instance === "undefined") {
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
      ipcRenderer.once("list-ecosystem-response", (event: any, error: any, procList: any) => {
        if (error) {
          reject(new AppError(1013, "PM2_LIST", error));
        } else {
          const processes: Process[] = [];
          if (procList.length === 4) {
            processes.push(Process.fromPM2(procList[0]));
            processes.push(Process.fromPM2(procList[1]));
            processes.push(Process.fromPM2(procList[2]));
            processes.push(Process.fromPM2(procList[3]));
          }
          resolve(processes);
        }
      });
      ipcRenderer.send("list-ecosystem");
    });
  }

  public startEcosystem(newHost?: string): Promise<Process[]> {
    return new Promise<Process[]>((resolve, reject) => {
      ipcRenderer.once("start-ecosystem-response", (event: any, error: any, procList: any, host: string) => {
        if (error) {
          reject(new AppError(1010, "PM2_START", error));
        } else {
          const proc1 = Process.fromPM2(procList[0][0], host);
          const proc2 = Process.fromPM2(procList[1][0], host);
          const proc3 = Process.fromPM2(procList[2][0], host);
          const proc4 = Process.fromPM2(procList[3][0], host);
          const processes: Process[] = [proc1, proc2, proc3, proc4];
          console.log('Received PM2 ecosystem info!');
          resolve(processes);
        }
      });
      ipcRenderer.send("start-ecosystem", newHost);
      console.log('Awaiting PM2 ecosystem results...')
    });
  }

  public killEcosystem(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      ipcRenderer.once("kill-ecosystem-response", (event: any, error: any) => {
        if (error) {
          reject(new AppError(1015, "PM2_KILL", error));
        } else {
          resolve(null);
        }
      });
      ipcRenderer.send("kill-ecosystem");
    });
  }

  public startProcess(process: Process, host?: string): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("start-process-response", (event: any, error: any, startedProcess: any) => {
        if (error) {
          reject(new AppError(1000, "PM2_START", error));
        } else {
          if (typeof startedProcess[0] === "undefined") {
            process.status = "error";
          } else {
            process.status = startedProcess[0].pm2_env.status;
          }
          resolve(process);
        }
      });
      ipcRenderer.send("start-process", process.name, host);
    });
  }

  public stopProcess(process: Process): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("stop-process-response", (event: any, error: any, stoppedProcess: any) => {
        if (error) {
          reject(new AppError(1001, "PM2_STOP", error));
        } else {
          if (typeof stoppedProcess[0] === "undefined") {
            process.status = "error";
          } else {
            process.status = stoppedProcess[0].pm2_env.status;
          }
          resolve(process);
        }
      });
      ipcRenderer.send("stop-process", process.name);
    });
  }

  public restartProcess(process: Process): Promise<Process> {
    return new Promise<Process>((resolve, reject) => {
      ipcRenderer.once("restart-process-response", (event: any, error: any, restartedProcess: any) => {
        if (error) {
          reject(new AppError(1002, "PM2_RESTART", error));
        } else {
          if (typeof restartedProcess[0] === "undefined") {
            process.status = "error";
          } else {
            process.status = restartedProcess[0].pm2_env.status;
          }
          resolve(process);
        }
      });
      ipcRenderer.send("restart-process", process.name);
    });
  }
}

export default ProcessManager.getInstance();
