const {ipcMain} = require("electron");
const pm2 = require("pm2");
const logger = require("./logger");

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

ipcMain.on("list-ecosystem", (event) => {
    logger.info("Listing application ecosystem...");
    event.sender.send("list-ecosystem-success");
});

ipcMain.on("start-ecosystem", (event, host) => {
    if (typeof host === "undefined" || host === null) {
        host = "127.0.0.1";
        logger.info(`Starting application with a default ${host} address.`);
    } else if (host.match(ipRegex) === null) {
        host = "127.0.0.1";
        logger.info(`Starting application with a default ${host} address.`);
    } else {
        logger.info(`Starting application with a ${host} address.`);
    }
});