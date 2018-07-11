const winston = require("winston");
const app = require("electron").app;
const path = require("path");
const appDataPath = app.getPath("appData") + path.sep + app.getName();
const logDir = path.join(appDataPath, "logs/");

module.exports = winston.createLogger({
    exitOnError: false,
    format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.printf(info => `[${info.level}][${info.timestamp}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logDir + "ems-main.log", colorize: false })
    ]
});

module.exports.info("EMS Main Process logger initialized and logging to: " + (logDir + "ems-main.log"));