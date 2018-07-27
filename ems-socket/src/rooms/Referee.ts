import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";

export default class RefereeRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;

  constructor(server: Server) {
    this._server = server;
    this._clients = [];
    this._name = "referee";
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
    console.log("Initializing referee events...");
  }

  get name(): string {
    return this._name;
  }
}