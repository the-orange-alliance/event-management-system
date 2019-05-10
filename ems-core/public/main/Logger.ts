import * as Winston from "winston";
import {app} from "electron";
import * as path from "path";

const appDataPath = app.getPath("appData") + path.sep + app.getName();
const logDir = path.join(appDataPath, "logs/");

export default Winston.createLogger({
  exitOnError: false,
  format: Winston.format.combine(
    Winston.format.colorize({ level: true }),
    Winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    Winston.format.printf(info => `[${info.level}][${info.timestamp}]: ${info.message}`)
  ),
  transports: [
    new Winston.transports.Console(),
    new Winston.transports.File({ filename: logDir + "ems-main.log"})
  ]
});