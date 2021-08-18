import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";
import ScoreManager from "../scoring/ScoreManager";
import {User} from "@the-orange-alliance/lib-ems";


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

  public addClient(client: Socket, user: User | null) {
    this._clients.push(client);
    this.initializeEvents(client, user);
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

  private initializeEvents(client: Socket, user: User | null) {
    if (this._timer.inProgress()) {
      setTimeout(() => {
        client.emit("data-update", ScoreManager.matchMetadata.toJSON());
      }, 500);
    }

    client.on("data-update", (dataJSON: any) => {
      if(!user || (user && !user.canRef)) return client.emit('Unauthorized', {event: 'data-update', required_priv: 'can_ref'});
      ScoreManager.updateMatchMetaData(dataJSON[0]);
      client.emit("data-update", ScoreManager.matchMetadata.toJSON());
    });
  }

  get name(): string {
    return this._name;
  }
}
