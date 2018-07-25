import socketIo, {Socket} from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";

/* Load our environment variables. The .env file is not included in the repository.
 * Only TOA staff/collaborators will have access to their own, specialized version of
 * the .env file.
 */
dotenv.config({path: path.join(__dirname, "../.env")});

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

const clients: Map<string, string> = new Map<string, string>();

/**
 * Main socket connection/event logic. We're not trying to be super secure, but inside of EMS you will (eventually)
 * be able to see all connected clients. Clients can't send/receive any events until they identify themselves.
 */
socket.on("connection", (client: Socket) => {
  logger.info(`Client connection (${client.id})`);
  client.on("identify", (params: string[]) => {
    logger.info(`Identified client ${client.id} as ${params[0]}.`);
    clients.set(client.id, params[0]);
    for (let i = 1; i < params.length; i++) {
      client.join(params[i]);
      logger.info(`Client ${client.id} joined ${params[i]}.`)
    }
  });
  client.on("request-video", (id: number) => {
    socket.to("scoring").emit("video-switch", id);
  });
});

server.listen({
  port: port,
  host: host
}, () => logger.info(`EMS Socket.IO running on ${host}:${port} in ${mode} mode.`));