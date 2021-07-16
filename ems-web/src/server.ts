import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as path from "path";
import * as dotenv from "dotenv";

/* Load our environment variables. The .env file is not included in the repository.
 * Only TOA staff/collaborators will have access to their own, specialized version of
 * the .env file.
 */
dotenv.config({path: path.join(__dirname, "../.env")});

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

const isProd: boolean = process.env.NODE_ENV === "production";
let staticPath: string = "../../*/build";
if (isProd) staticPath = "../../../public/*";
app.use(express.static(path.join(__dirname, staticPath.replace("*", "ems-home"))));
app.use(express.static(path.join(__dirname, staticPath.replace("*", "audience-display"))));
app.use(express.static(path.join(__dirname, staticPath.replace("*", "ref-tablet"))));

app.use("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.length > 1) {
    next();
  } else {
    // res.cookie("host", host, {secure: false, httpOnly: false, maxAge: 600000});
    res.sendFile(path.join(__dirname, staticPath.replace("*", "ems-home") + "/index.html"));
  }
});

app.use("/audience", (req: express.Request, res: express.Response) => {
  res.cookie("host", host, {secure: false, httpOnly: false, maxAge: 600000});
  res.sendFile(path.join(__dirname, staticPath.replace("*", "audience-display") + "/index.html"));
});

app.use("/ref", (req: express.Request, res: express.Response) => {
  res.cookie("host", host, {secure: false, httpOnly: false, maxAge: 600000});
  res.sendFile(path.join(__dirname, staticPath.replace("*", "ref-tablet") + "/index.html"));
});


app.use("/monitor", (req: express.Request, res: express.Response) => {
  res.cookie("host", host, {secure: false, httpOnly: false, maxAge: 600000});
  res.sendFile(path.join(__dirname, staticPath.replace("*", "monitor") + "/index.html"));
});

app.use("/ping", (req: express.Request, res: express.Response) => {
  res.send({res: "pong!"});
});

app.get("*", (req, res) => {
  res.status(404).send("Content not found.");
});


http.createServer(app).listen({
  port: port,
  host: host
}, () => console.log(`EMS web server running on ${host}:${port} in ${mode} mode.`));
