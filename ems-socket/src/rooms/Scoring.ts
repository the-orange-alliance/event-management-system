import {Server, Socket} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";
import {MatchMode} from "../scoring/MatchMode";
import ScoreManager from "../scoring/ScoreManager";
import {EMSProvider, Match} from "@the-orange-alliance/lib-ems";

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
  private _mode: string;

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
    this._mode = "UNDEFINED";
  }

  public addClient(client: Socket) {
    this._clients.push(client);
    this.initializeEvents(client);
    logger.info(`Client ${client.id} joined '${this._name}'.`); // TODO - Figure out why evnts aren't sending...
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
      client.emit("score-update", ScoreManager.getJSON(), this._timer.matchConfig.toJSON());
      setTimeout(() => {
        client.emit("match-end");
      }, 500);
    }

    // In case tablet or audience display disconnects mid-match
    if (this._timer.inProgress()) {
      logger.info("Sending current match information to newly connectedclient.");
      // TODO - Think about?!
      client.emit("score-update", ScoreManager.getJSON(), this._timer.matchConfig.toJSON());
    }

    // In case tablet or audience display disconnects after prestart, but before match play.
    if (!this._timer.inProgress() && this._hasPrestarted) {
      logger.info("Detected that client disconnected after prestart. Sending match info for " + ScoreManager.match.matchKey + ".");
      client.emit("prestart-response", null, ScoreManager.getJSON(), 2);
    }

    client.on("get-mode", () => {
      setTimeout(() => {
        client.emit("mode-update", this._mode);
      }, 500);
    });
    client.on("score-update", (matchJSON: any) => {
      if (this._timer.inProgress() || this._timer.mode === MatchMode.PRESTART || !this._hasCommittedScore) {
        if (matchJSON[0] && typeof matchJSON[0].match_key !== "undefined" && matchJSON[0].match_key.length > 0) {
          ScoreManager.updateMatch(matchJSON[0]);
          // TODO - Think about what to do here...
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
    client.on("prestart", (matchKey: string) => {
      this.getMatch(matchKey).then((match: Match) => {
        logger.info(`Successfully prestarted match ${match.matchKey}`);
        ScoreManager.match = match;
        this._timer.mode = MatchMode.PRESTART;
        this._hasPrestarted = true;
        this._currentMatchKey = match.matchKey;
        this._currentFieldNumber = match.fieldNumber;
        this._currentVideoID = 1;
        this._mode = "PRESTART";
        this._server.to("scoring").emit("prestart-response", null, ScoreManager.getJSON());
        this._server.to("scoring").emit("score-update", ScoreManager.getJSON());
        this._server.to("referee").emit("data-update", ScoreManager.matchMetadata.toJSON());
      }).catch((reason: any) => {
        client.send("prestart-response", reason, null);
      });
    });
    client.on("commit-scores", (matchKey: string) => {
      this._server.to("scoring").emit("commit-scores", matchKey);
      this._timer.mode = MatchMode.RESET;
      this._hasCommittedScore = true;
    });
    client.on("start", () => {
      if (!this._timer.inProgress()) {
        this._timer.once("match-start", () => {
          this._server.to("scoring").emit("match-start", this._timer.matchConfig.toJSON());
          this._hasCommittedScore = false;
          this._hasPrestarted = false;
          this._currentVideoID = 2; // Universal MatchPlay screen.
          this._mode = "AUTONOMOUS";
        });
        this._timer.once("match-auto", () => {
          this._server.to("scoring").emit("match-auto");
        });
        this._timer.once("match-tele", () => {
          this._server.to("scoring").emit("match-tele");
          this._mode = "TELEOP";
        });
        this._timer.once("match-endgame", () => {
          this._server.to("scoring").emit("match-endgame");
          this._mode = "ENDGAME";
        });
        this._timer.once("match-end", () => {
          this._server.to("scoring").emit("match-end");
          this._timer.removeAllListeners("match-abort");
          this._timer.removeAllListeners("match-auto");
          this._timer.removeAllListeners("match-tele");
          this._timer.removeAllListeners("match-endgame");
          this._mode = "MATCH END";
        });
        this._timer.once("match-abort", () => {
          this._server.to("scoring").emit("match-abort");
          this._timer.removeAllListeners("match-end");
          this._timer.removeAllListeners("match-auto");
          this._timer.removeAllListeners("match-tele");
          this._timer.removeAllListeners("match-endgame");
          this._mode = "MATCH ABORTED";
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
        if (typeof timerJSON[0].delay_time !== "undefined") {
          this._timer.matchConfig.delayTime = timerJSON[0].delay_time;
        }
        if (typeof timerJSON[0].auto_time !== "undefined") {
          this._timer.matchConfig.autoTime = timerJSON[0].auto_time;
        }
        if (typeof timerJSON[0].transition_time !== "undefined") {
          this._timer.matchConfig.transitionTime = timerJSON[0].transition_time;
        }
        if (typeof timerJSON[0].tele_time !== "undefined") {
          this._timer.matchConfig.teleTime = timerJSON[0].tele_time;
        }
        if (typeof timerJSON[0].end_time !== "undefined") {
          this._timer.matchConfig.endTime = timerJSON[0].end_time;
        }
        const config = this._timer.matchConfig;
        logger.warn("-------- TIMER CONFIGURATION UPDATED --------");
        logger.warn(`DELAY     : ${config.delayTime}`);
        logger.warn(`AUTONOMOUS: ${config.autoTime}`);
        logger.warn(`TRANSITION: ${config.transitionTime}`);
        logger.warn(`TELEOP    : ${config.teleTime}`);
        logger.warn(`ENDGAME   : ${config.endTime}`);
        logger.warn(`TOTAL TIME: ${config.totalTime}`);
        logger.warn("-------- TIMER CONFIGURATION UPDATED --------")
      }
    });
  }

  private getMatch(matchKey: string): Promise<Match> {
    return new Promise<Match>((resolve, reject) => {
      const promises: Array<Promise<any>> = [];
      promises.push(EMSProvider.getMatch(matchKey));
      promises.push(EMSProvider.getMatchDetails(matchKey));
      promises.push(EMSProvider.getMatchParticipants(matchKey));
      Promise.all(promises).then((res: any) => {
        if (res && res[0]) {
          const match: Match = res[0];
          if (res[1] && res[1][0]) {
            match.matchDetails = res[1][0];
          }
          if (res[2] && res[2].length > 0) {
            match.participants = res[2];
          }
          resolve(match);
        } else {
          reject();
        }
      }).catch((reason: any) => {
        reject(reason);
      });
    });
  }

  get name(): string {
    return this._name;
  }
}
