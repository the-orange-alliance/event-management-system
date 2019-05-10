import {IpcMessageEvent, ipcMain} from "electron";
import * as path from "path";
import * as pm2 from "pm2";
import logger from "./logger";

const localIPv4 = require("local-ipv4-address");

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;
const isProd = process.env.NODE_ENV === "production";

ipcMain.on("kill-ecosystem", (event: IpcMessageEvent) => {
  logger.info("Killing application ecosystem...");
  pm2.connect((err) => {
    if (err) {
      event.sender.send("kill-ecosystem-response", err);
    } else {
      pm2.killDaemon((errList) => {
        pm2.disconnect();
        event.sender.send("kill-ecosystem-response", errList);
      });
    }
  });
});

ipcMain.on("list-ecosystem", (event: IpcMessageEvent) => {
  logger.info("Listing application ecosystem...");
  pm2.connect((err) => {
    if (err) {
      event.sender.send("list-ecosystem-response", err, undefined);
    } else {
      pm2.list((errList, procDescList) => {
        pm2.disconnect();
        logger.info("Process description list results were sent back to the renderer process.");
        event.sender.send("list-ecosystem-response", errList, procDescList);
      });
    }
  });
});

ipcMain.on("start-ecosystem", (event: IpcMessageEvent, host: string) => {
  localIPv4().then((localHost: string) => {
    if (localHost === "Default") {
      localHost = "127.0.0.1";
    }
    if (typeof host === "undefined" || host === null) {
      host = localHost;
      logger.info(`Starting services with a default ${host} address.`);
    } else if (host.match(ipRegex) === null || localHost.match(ipRegex) === null) {
      host = "127.0.0.1";
      logger.info(`Starting services with a default ${host} address.`);
    } else {
      logger.info(`Starting services with a ${host} address.`);
    }
    pm2.connect((err) => {
      if (err) {
        event.sender.send("start-ecosystem-response", err, undefined, undefined);
      } else {
        let base = "../";
        if (isProd) {
          base = path.join(__dirname, "../../../server/");
        }
        logger.info(`Using base path ${base} for services...`);
        const apiProc = startProcess(base + "ems-api/build/server.js", "ems-api", host);
        const webProc = startProcess(base + "ems-web/build/server.js", "ems-web", host);
        const sckProc = startProcess(base + "ems-socket/build/server.js", "ems-sck", host);
        Promise.all([apiProc, webProc, sckProc]).then((values) => {
          pm2.disconnect();
          logger.info(`Successfully started application ecosystem on ${host}`);
          event.sender.send("start-ecosystem-response", undefined, values, host);
        }).catch((reason) => {
          pm2.disconnect();
          logger.info("Error while starting application ecosystem. Results were sent to renderer process.");
          event.sender.send("start-ecosystem-response", reason, undefined, undefined);
        });
      }
    });
  });
});

ipcMain.on("start-process", (event: IpcMessageEvent, procName: string, host: string) => {
  localIPv4().then((localHost: string) => {
    if (localHost === "Default") {
      localHost = "127.0.0.1";
    }
    if (typeof host === "undefined" || host === null) {
      host = localHost;
      logger.info(`Starting services with a default ${host} address.`);
    } else if (host.match(ipRegex) === null) {
      host = "127.0.0.1";
      logger.info(`Starting services with a default ${host} address.`);
    } else {
      logger.info(`Starting services with a ${host} address.`);
    }
    logger.info("Attempting to start " + procName + " service...");
    pm2.connect((err) => {
      if (err) {
        event.sender.send("start-process-response", err, undefined);
      } else {
        startProcess(procName, host).then((process) => {
          logger.info(`Successfully started application ${procName}`);
          event.sender.send("start-process-response", undefined, process);
        }).catch((reason) => {
          logger.info(`Error while starting application ${procName}. Results were sent back to the renderer process.`);
          event.sender.send("start-process-response", reason, undefined);
        });
      }
    });
  });
});

ipcMain.on("stop-process", (event: IpcMessageEvent, procName: string) => {
  logger.info("Attempting to stop " + procName + " service...");
  pm2.connect((err) => {
    if (err) {
      event.sender.send("stop-process-response", err, undefined);
    } else {
      stopProcess(procName).then((process) => {
        logger.info(`Successfully stopped application ${procName}`);
        event.sender.send("stop-process-response", undefined, process);
      }).catch((reason) => {
        logger.info(`Error while stopping application ${procName}. Results were sent back to the renderer process.`);
        event.sender.send("stop-process-response", reason, undefined);
      });
    }
  });
});

ipcMain.on("restart-process", (event: IpcMessageEvent, procName: string) => {
  logger.info("Attempting to restart " + procName + " service...");
  pm2.connect((err) => {
    if (err) {
      event.sender.send("restart-process-response", err, undefined);
    } else {
      restartProcess(procName).then((process) => {
        logger.info(`Successfully restarted application ${procName}`);
        event.sender.send("restart-process-response", undefined, process);
      }).catch((reason) => {
        logger.info(`Error while restarting application ${procName}. Results were sent back to the renderer process.`);
        event.sender.send("restart-process-response", reason, undefined);
      });
    }
  });
});

ipcMain.on("get-logs", (event: IpcMessageEvent) => {
  event.sender.send("get-logs-response");
});

function startProcess(scriptLoc: string, procName: string, args?: any) {
  const modulesPath = path.join(__dirname, "../../../node_modules"); // Services in production need to know the node_modules path
  args = args || "";
  return new Promise((resolve, reject) => {
    pm2.start({
      args: args,
      env: isProd ? {NODE_PATH: modulesPath} : {},
      name: procName,
      script: scriptLoc
    }, (err, apps) => {
      if (err) {
        reject(err);
      } else {
        resolve(apps);
      }
    });
  });
}

function stopProcess(procName: string) {
  return new Promise((resolve, reject) => {
    pm2.stop(procName, (err, process) => {
      if (err) {
        reject(err);
      } else {
        resolve(process);
      }
    });
  });
}

function restartProcess(procName: string) {
  return new Promise((resolve, reject) => {
    pm2.restart(procName, (err, process) => {
      if (err) {
        reject(err);
      } else {
        resolve(process);
      }
    });
  });
}