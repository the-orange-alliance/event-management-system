import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";

export default class ScoringRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;
  private readonly _timer: MatchTimer;

  constructor(server: Server, matchTimer: MatchTimer) {
    this._server = server;
    this._clients = [];
    this._name = "scoring";
    this._timer = matchTimer;
  }

  public addClient(client: Socket) {
    this._clients.push(client);
    this.initializeEvents(client);
    logger.info(`Client ${client.id} joined '${this._name}'.`);
  }

  public removeClient(client: Socket) {
    if (this._clients.indexOf(client) > -1) {
      this._clients.splice(this._clients.indexOf(client), 1);
      logger.info(`Client ${client.id} left ${this._name}'.`);
    }
  }

  public getClients(): Socket[] {
    return this._clients;
  }

  private initializeEvents(client: Socket) {
    client.on("request-video", (id: number) => {
      this._server.to("scoring").emit("video-switch", id);
    });
    client.on("prestart", (matchKey: string) => {
      this._server.to("scoring").emit("prestart", matchKey);
    });
    client.on("start", () => {
      if (!this._timer.inProgress()) {
        this._timer.start();
        this._timer.once("match-start", (timeLeft: number) => {
          this._server.to("scoring").emit("match-start", timeLeft);
        });
        this._timer.once("match-auto", () => {
          this._server.to("scoring").emit("match-auto");
        });
        this._timer.once("match-tele", () => {
          this._server.to("scoring").emit("match-tele");
        });
        this._timer.once("match-endgame", () => {
          this._server.to("scoring").emit("match-endgame");
        });
        this._timer.once("match-end", () => {
          this._server.to("scoring").emit("match-end");
          this._timer.removeAllListeners("match-abort");
        });
        this._timer.once("match-abort", () => {
          this._server.to("scoring").emit("match-abort");
          this._timer.removeAllListeners("match-end");
        });
      }
    });
    client.on("abort", () => {
      if (this._timer.inProgress()) {
        this._timer.abort();
      }
    });
  }

  get name(): string {
    return this._name;
  }
}