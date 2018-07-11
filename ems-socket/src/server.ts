import socketIo, {Socket} from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import logger from "./logger";

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

const app: express.Application = express();
const server = http.createServer(app);
const socket = socketIo(server);
const mode = (process.env.NODE_ENV || "development").toUpperCase();
const port = process.env.PORT || 8800;
let host = process.env.HOST || "127.0.0.1";

if (process.argv[2] && process.argv[2].match(ipRegex)) {
  host = process.argv[2];
}

app.use(cors());
app.use("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

socket.on("connection", (client: Socket) => {
  logger.info("Client connection.");
  client.emit("connect");
});

server.listen({
  port: port,
  host: host
}, () => logger.info(`EMS Socket.IO running on ${host}:${port} in ${mode} mode.`));