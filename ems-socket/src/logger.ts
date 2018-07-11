import * as Winston from "winston";

const logger = Winston.createLogger({
  transports: [
    new Winston.transports.Console()
  ],
  format: Winston.format.combine(
    Winston.format.colorize({level: true}),
    Winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    Winston.format.printf(info => `[${info.level}][${info.timestamp}]: ${info.message}`)
  ),
  exitOnError: false
});

export default logger;