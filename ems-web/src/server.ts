import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

const app: express.Application = express();
const mode = (process.env.NODE_ENV || "development").toUpperCase();
const port = process.env.PORT || 80;
let host = process.env.HOST || "127.0.0.1";

if (process.argv[2] && process.argv[2].match(ipRegex)) {
  host = process.argv[2];
}

app.use(cors());
app.use(cookieParser());

app.use("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

http.createServer(app).listen({
  port: port,
  host: host
}, () => console.log(`EMS web server running on ${host}:${port} in ${mode} mode.`));