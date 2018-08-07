import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import RefereeEvents from "../scoring/energy-impact/RefereeEvents";
import MatchTimer from "../scoring/MatchTimer";

export default class RefereeRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;
  private readonly _timer: MatchTimer;

  constructor(server: Server, timer: MatchTimer) {
    this._server = server;
    this._clients = [];
    this._name = "referee";
    this._timer = timer;
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
    RefereeEvents.initialize(this._server, client, this._timer);
  }

  get name(): string {
    return this._name;
  }
}
