import {Server, Socket} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";
import {MatchMode} from "../scoring/MatchMode";
import ScoreManager from "../scoring/ScoreManager";

export default class ScoringRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;
  private readonly _timer: MatchTimer;
  private _hasCommittedScore: boolean;
  private _hasPrestarted: boolean;
  private _currentMatchKey: string;
  private _currentFieldNumber: number;
  private _currentVideoID: number;

  constructor(server: Server, matchTimer: MatchTimer) {
    this._server = server;
    this._clients = [];
    this._name = "scoring";
    this._timer = matchTimer;
    this._hasCommittedScore = false;
    this._hasPrestarted = false;
    this._currentMatchKey = "";
    this._currentFieldNumber = -1;
    this._currentVideoID = -1;
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
    // Rebroadcast the current videoID.
    // TODO - This logic needs to be thought out more...
    if (this._currentVideoID !== -1) {
      client.emit("video-switch", this._currentVideoID);
    }

    // In case EMS itself disconnects mid-match.
    if (!this._timer.inProgress() && this._timer.mode === MatchMode.ENDED && !this._hasCommittedScore) {
      logger.info("Detected that client previously disconnected during match. Sending last match results.");
      client.emit("score-update", ScoreManager.match.toJSON());
      setTimeout(() => {
        client.emit("match-end");
      }, 500);
    }

    // In case tablet or audience display disconnects mid-match
    if (this._timer.inProgress()) {
      logger.info("Sending current match information to newly connected client.");
      setTimeout(() => {
        client.emit("score-update", ScoreManager.match.toJSON());
      }, 500);
    }

    // In case tablet or audience display disconnects after prestart, but before match play.
    if (!this._timer.inProgress() && this._hasPrestarted) {
      logger.info("Detected that client disconnected after prestart. Sending match info for " + ScoreManager.match.matchKey + ".");
      client.emit("prestart", this._currentMatchKey, this._currentFieldNumber);
      setTimeout(() => {
        client.emit("score-update", ScoreManager.match.toJSON());
      }, 500);
    }

    client.on("score-update", (matchJSON: any) => {
      if (this._timer.inProgress() || this._timer.mode === MatchMode.PRESTART) {
        if (matchJSON[0] && typeof matchJSON[0].match_key !== "undefined" && matchJSON[0].match_key.length > 0) {
          ScoreManager.updateMatch(matchJSON[0]);
          this._server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
        } else {
          logger.warn("Client sent an empty matchKey. Ignoring score update.");
        }
      }
    });
    client.on("request-video", (id: number) => {
      this._currentVideoID = id;
      this._server.to("scoring").emit("video-switch", id);
    });
    client.on("prestart", (matchKey: string, fieldNumber: number) => {
      this._server.to("scoring").emit("prestart", matchKey, fieldNumber);
      ScoreManager.reset(matchKey);
      ScoreManager.createDetails();
      this._timer.mode = MatchMode.PRESTART;
      this._hasPrestarted = true;
      this._currentMatchKey = matchKey;
      this._currentFieldNumber = fieldNumber;

      this._server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      this._server.to("referee").emit("data-update", ScoreManager.matchMetadata.toJSON());
    });
    client.on("commit-scores", (matchKey: string) => {
      this._server.to("scoring").emit("commit-scores", matchKey);
      this._timer.mode = MatchMode.RESET;
      this._hasCommittedScore = true;
    });
    client.on("start", () => {
      if (!this._timer.inProgress()) {
        this._timer.once("match-start", (timeLeft: number) => {
          this._server.to("scoring").emit("match-start", timeLeft);
          this._hasCommittedScore = false;
          this._hasPrestarted = false;
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
          this._timer.removeAllListeners("match-auto");
          this._timer.removeAllListeners("match-tele");
          this._timer.removeAllListeners("match-endgame");
        });
        this._timer.once("match-abort", () => {
          this._server.to("scoring").emit("match-abort");
          this._timer.removeAllListeners("match-end");
          this._timer.removeAllListeners("match-auto");
          this._timer.removeAllListeners("match-tele");
          this._timer.removeAllListeners("match-endgame");
        });
        this._timer.start();
      }
    });
    client.on("abort", () => {
      if (this._timer.inProgress()) {
        this._timer.abort();
      }
    });
    client.on("update-timer", (timerJSON: any) => {
      if (!this._timer.inProgress()) {
        if (typeof timerJSON.delay_time !== "undefined") {
          this._timer.delayTime = timerJSON.delay_time;
        }
        if (typeof timerJSON.auto_time !== "undefined") {
          this._timer.autoTime = timerJSON.auto_time;
        }
        if (typeof timerJSON.tele_time !== "undefined") {
          this._timer.teleTime = timerJSON.tele_time;
        }
        if (typeof timerJSON.end_time !== "undefined") {
          this._timer.endTime = timerJSON.end_time;
        }
      }
    });
  }

  get name(): string {
    return this._name;
  }
}
