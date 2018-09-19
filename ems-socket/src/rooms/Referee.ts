import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";
import ScoreManager from "../scoring/ScoreManager";
import Match from "../shared/Match";
import MatchDetails from "../shared/MatchDetails";
import MatchParticipant from "../shared/MatchParticipant";

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

    client.emit("score-update", ScoreManager.match.toJSON());

    client.on("update", (matchJSON: any) => {
      if (this._timer.inProgress()) {
        ScoreManager.match = new Match().fromJSON(matchJSON);
        if (typeof matchJSON.details !== "undefined") {
          const seasonKey: number = parseInt(ScoreManager.match.matchKey.split("-")[0], 10);
          ScoreManager.match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
        }
        if (typeof matchJSON.participants !== "undefined") {
          ScoreManager.match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));
        }
        this._server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });
  }

  get name(): string {
    return this._name;
  }
}
