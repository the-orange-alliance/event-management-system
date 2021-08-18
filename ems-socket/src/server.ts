import socketIo, {Socket} from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import logger from "./logger";
import * as path from "path";
import * as dotenv from "dotenv";
import ScoringRoom from "./rooms/Scoring";
import EventRoom from "./rooms/Event";
import RefereeRoom from "./rooms/Referee";
import MatchTimer from "./scoring/MatchTimer";
import {EMSProvider, FGC_CONFIG, FRC_CONFIG, User} from "@the-orange-alliance/lib-ems";
import FmsRoom from "./rooms/FMS";
import * as fs from "fs";
import getAppDataPath from "appdata-path";

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

const timer = new MatchTimer();
timer.matchConfig = FRC_CONFIG;
const clients: Map<string, string[]> = new Map<string, string[]>();
const scoringRoom = new ScoringRoom(socket, timer);
const eventRoom = new EventRoom(socket);
const refereeRoom = new RefereeRoom(socket, timer);
const fmsRoom = new FmsRoom(socket);

EMSProvider.initialize(host, parseInt(process.env.API_PORT as string, 10));

const authLoop = async (recursive: boolean) => {
  logger.info('Attempting to load api key from file...');
  try {
    const credDir = path.join(getAppDataPath(""), "ems-core", "socket-key.json");
    const key = JSON.parse(fs.readFileSync(credDir, {encoding: 'utf-8'}));
    await EMSProvider.authApiKey(key.key).then(() => logger.info('Successfully authenticated to EMS-API!'));
    // Setup renew reauth every hour, if this isn't a recursive call
    if(!recursive) {
      setInterval( () => {
        EMSProvider.authApiKey(key.key).then(() => {
          logger.info('Renewed API Key')
        }).catch(() => {
          logger.warn('Failed to reauthenticate API Key, reloading key from file...');
          authLoop(true);
        });
      }, 1000 * 60 * 60)
    }
  } catch {
    logger.info('EMS-API Authorization failed. Trying again in 1 second...');
    await new Promise<void>((resolve) => {setTimeout(() => resolve(), 1000)});
    await authLoop(recursive);
  }
};

authLoop(false);

/**
 * Main socket connection/event logic. We're not trying to be super secure, but inside of EMS you will (eventually)
 * be able to see all connected clients. Clients can't send/receive any events until they identify themselves.
 */
socket.on("connection", async (client: Socket) => {

  const user: User | null = await EMSProvider.verifyAuth(client.handshake.query.authorization).catch((err) => {logger.error(err); return null});

  if (user) logger.info(`Client connection '${client.id}' authenticated. Privileges: ${(user.canRef ? 'Ref,' : '')} ${(user.canControlFms ? 'FMS,' : '')} ${(user.canControlMatch ? 'Match Control,' : '')} ${(user.canControlEvent ? 'Event Control' : '')}`);
  if (!user) logger.info(`Client connection '${client.id}' connected with no or invalid authorization.`);

  client.on("identify", (clientStr: string, rooms: string[]) => {
    logger.info(`Identified client ${client.id} [${clientStr} joining (${rooms})].`);
    if (Array.isArray(rooms)) {
      clients.set(client.id, rooms);
      for (const room of rooms) {
        client.join(room);
        if (room === "scoring") {
          scoringRoom.addClient(client, user);
        }
        if (room === "event") {
          eventRoom.addClient(client, user);
        }
        if (room === "referee") {
          refereeRoom.addClient(client, user);
        }
        if (room === "fms") {
          fmsRoom.addClient(client, user);
        }
      }
    } else {
      logger.warn("Denied previous client from joining rooms (incorrect parameters).");
    }
  });

  // TODO: Close Socket when token/api key/account are deleted, removed, or revoked
  // TODO: API emits 'token-revoked' when a token is revoked, 'user-removed' when user is deleted, and 'apikey-removed' when an apikey is deleted
  client.on("token-revoked", (key: string) => {
    if(!user || (user && !user.canControlEvent)) return client.emit('Unauthorized', {event: 'key-revoked', required_priv: 'can_control_event'});
    // TODO find client, close socket
  });
  client.on("user-removed", (key: string) => {
    if(!user || (user && !user.canControlEvent)) return client.emit('Unauthorized', {event: 'key-revoked', required_priv: 'can_control_event'});
    // TODO find client, close socket
  });
  client.on("apikey-removed", (key: string) => {
    if(!user || (user && !user.canControlEvent)) return client.emit('Unauthorized', {event: 'key-revoked', required_priv: 'can_control_event'});
    // TODO find client, close socket
  });
  client.on("disconnect", () => {
    scoringRoom.removeClient(client);
    eventRoom.removeClient(client);
    refereeRoom.removeClient(client);
    fmsRoom.removeClient(client);
  });
  client.on("drip", () => {
    client.emit("drop");
  });
});

server.listen({
  port: port,
  host: host,
}, () => logger.info(`EMS Socket.IO running on ${host}:${port} in ${mode} mode.`));
