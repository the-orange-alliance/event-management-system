const {ipcMain} = require("electron");
const path = require("path");
const pm2 = require("pm2");
const logger = require("./logger");
const localIPv4 = require("local-ipv4-address");
const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;
const isProd = process.env.NODE_ENV === "production";

ipcMain.on("list-ecosystem", (event) => {
    logger.info("Listing application ecosystem...");
    pm2.connect((err) => {
        if (err) {
            event.sender.send("list-ecosystem-error", err);
        } else {
            pm2.list((errList, procDescList) => {
                pm2.disconnect();
                logger.info("Process description list results were sent back to the renderer process.");
                if (errList) {
                    event.sender.send("list-ecosystem-error", errList);
                } else {
                    event.sender.send("list-ecosystem-success", procDescList);
                }
            });
        }
    });
});

ipcMain.on("start-ecosystem", (event, host) => {
    localIPv4().then((localHost) => {
        if (typeof host === "undefined" || host === null) {
            host = localHost;
            logger.info(`Starting services with a default ${host} address.`);
        } else if (host.match(ipRegex) === null) {
            host = "127.0.0.1";
            logger.info(`Starting services with a default ${host} address.`);
        } else {
            logger.info(`Starting services with a ${host} address.`);
        }
        pm2.connect((err) => {
            if (err) {
                event.sender.send("start-ecosystem-error", err);
            } else {
                let base = "../";
                if (isProd) {
                    base = path.join(__dirname, "../server/");
                }
                const apiProc = startProcess(base + "ems-api/build/server.js", "ems-api", host);
                const webProc = startProcess(base + "ems-web/build/server.js", "ems-web", host);
                const sckProc = startProcess(base + "ems-socket/build/server.js", "ems-sck", host);
                Promise.all([apiProc, webProc, sckProc]).then((values) => {
                    pm2.disconnect();
                    logger.info(`Successfully started application ecosystem on ${host}`);
                    event.sender.send("start-ecosystem-success", values, host);
                }).catch((reason) => {
                    pm2.disconnect();
                    logger.info("Error while starting application ecosystem. Results were sent to renderer process.");
                    event.sender.send("start-ecosystem-error", reason);
                });
            }
        });
    });
});

ipcMain.on("start-process", (event, procName, host) => {
    localIPv4().then((localHost) => {
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
                event.sender.send("start-process-error", err);
            } else {
                startProcess(procName, host).then((process) => {
                    logger.info(`Successfully started application ${procName}`);
                    event.sender.send("start-process-success", process);
                }).catch((reason) => {
                    logger.info(`Error while starting application ${procName}. Results were sent back to the renderer process.`);
                    event.sender.send("start-process-error", reason);
                });
            }
        });
    });
});

ipcMain.on("stop-process", (event, procName) => {
    logger.info("Attempting to stop " + procName + " service...");
    pm2.connect((err) => {
        if (err) {
            event.sender.send("stop-process-error", err);
        } else {
            stopProcess(procName).then((process) => {
                logger.info(`Successfully stopped application ${procName}`);
                event.sender.send("stop-process-success", process);
            }).catch((reason) => {
                logger.info(`Error while stopping application ${procName}. Results were sent back to the renderer process.`);
                event.sender.send("stop-process-error", reason);
            });
        }
    });
});

ipcMain.on("restart-process", (event, procName) => {
    logger.info("Attempting to restart " + procName + " service...");
    pm2.connect((err) => {
        if (err) {
            event.sender.send("restart-process-error", err);
        } else {
            restartProcess(procName).then((process) => {
                logger.info(`Successfully restarted application ${procName}`);
                event.sender.send("restart-process-success", process);
            }).catch((reason) => {
                logger.info(`Error while restarting application ${procName}. Results were sent back to the renderer process.`);
                event.sender.send("restart-process-error", reason);
            });
        }
    });
});

function startProcess(scriptLoc, procName, args) {
    args = args || "";
    return new Promise((resolve, reject) => {
        pm2.start({
            args: args,
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

function stopProcess(procName) {
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

function restartProcess(procName) {
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