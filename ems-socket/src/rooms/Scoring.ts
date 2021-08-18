import {Server, Socket} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import MatchTimer from "../scoring/MatchTimer";
import {MatchMode} from "../scoring/MatchMode";
import ScoreManager from "../scoring/ScoreManager";
import {EMSProvider, IFieldControlPacket, Match, User} from "@the-orange-alliance/lib-ems";
import {
  PACKET_ABORT, PACKET_BALL_RESET,
  PACKET_BLUE_BOT_RESET,
  PACKET_BLUE_BOT_SCORE, PACKET_BLUE_MID_RESET,
  PACKET_BLUE_MID_SCORE, PACKET_BLUE_TOP_RESET, PACKET_BLUE_TOP_SCORE, PACKET_COMMIT, PACKET_PRESTART,
  PACKET_RED_BOT_RESET,
  PACKET_RED_BOT_SCORE, PACKET_RED_MID_RESET,
  PACKET_RED_MID_SCORE, PACKET_RED_TOP_RESET,
  PACKET_RED_TOP_SCORE, PACKET_RESET, PACKET_START
} from "../packets";

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

  private _ledTimers: any[];
  private _ledTimes: number[];

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

    this._ledTimers = [null, null, null, null, null, null];
    this._ledTimes = [0, 0, 0, 0, 0, 0];
  }

  public addClient(client: Socket, user: User | null) {
    this._clients.push(client);
    this.initializeEvents(client, user);
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

  private initializeEvents(client: Socket, user: User | null) {
    if (!this._hasPrestarted && !this._hasCommittedScore && !this._timer.inProgress()) {
      this._server.to("scoring").emit("control-update", PACKET_BALL_RESET);
    }

    // Rebroadcast the current videoID.
    if (this._currentVideoID !== -1) {
      client.emit("video-switch", this._currentVideoID);
    }

    // In case EMS itself disconnects mid-match.
    if (!this._timer.inProgress() && this._timer.mode === MatchMode.ENDED && !this._hasCommittedScore) {
      logger.info("Detected that client previously disconnected during match. Sending last match results.");
      client.emit("prestart-response", null, ScoreManager.getJSON(), 3);
      setTimeout(() => {
        client.emit("match-end");
      }, 500);
    }

    // In case tablet or audience display disconnects mid-match
    if (this._timer.inProgress()) {
      logger.info("Sending current match information to newly connected client.");
      // TODO - Think about?!
      client.emit("prestart-response", null, ScoreManager.getJSON(), 2);
    }

    // In case tablet or audience display disconnects after prestart, but before match play.
    if (!this._timer.inProgress() && this._hasPrestarted) {
      logger.info("Detected that client disconnected after prestart. Sending match info for " + ScoreManager.match.matchKey + ".");
      client.emit("prestart-response", null, ScoreManager.getJSON(), this._currentVideoID);
    }

    client.on("get-mode", () => {
      setTimeout(() => {
        client.emit("mode-update", this._mode);
      }, 500);
    });
    client.on("score-update", (matchJSON: any) => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'score-update', required_priv: 'can_control_match'});
      if (this._timer.inProgress() || this._timer.mode === MatchMode.PRESTART || !this._hasCommittedScore) {
        if (matchJSON && typeof matchJSON.match_key !== "undefined" && matchJSON.match_key.length > 0) {
          if (typeof matchJSON.details !== "undefined" && typeof matchJSON.participants !== "undefined") {

            // Before score updates, handle sending package messages.
            if (matchJSON.details.red_processing_barge_reuse > ScoreManager.getJSON().details.red_processing_barge_reuse) {
              this._server.to("scoring").emit("control-update", PACKET_RED_TOP_SCORE);
              this.updateInterval(0, true, 0);
            } else if (matchJSON.details.red_processing_barge_recycle > ScoreManager.getJSON().details.red_processing_barge_recycle) {
              this._server.to("scoring").emit("control-update", PACKET_RED_MID_SCORE);
              this.updateInterval(0, true, 1);
            } else if (matchJSON.details.red_processing_barge_recovery > ScoreManager.getJSON().details.red_processing_barge_recovery) {
              this._server.to("scoring").emit("control-update", PACKET_RED_BOT_SCORE);
              this.updateInterval(0, true, 2);
            }

            if (matchJSON.details.blue_processing_barge_reuse > ScoreManager.getJSON().details.blue_processing_barge_reuse) {
              this._server.to("scoring").emit("control-update", PACKET_BLUE_TOP_SCORE);
              this.updateInterval(3, false, 0);
            } else if (matchJSON.details.blue_processing_barge_recycle > ScoreManager.getJSON().details.blue_processing_barge_recycle) {
              this._server.to("scoring").emit("control-update", PACKET_BLUE_MID_SCORE);
              this.updateInterval(4, false, 1);
            } else if (matchJSON.details.blue_processing_barge_recovery > ScoreManager.getJSON().details.blue_processing_barge_recovery) {
              this._server.to("scoring").emit("control-update", PACKET_BLUE_BOT_SCORE);
              this.updateInterval(5, false, 2);
            }

            // Finally, handle score updates.
            ScoreManager.updateMatch(matchJSON);
            this._server.to("scoring").emit("score-update", ScoreManager.getJSON());
          }
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
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'prestart', required_priv: 'can_control_match'});
      logger.info(`Initiating prestart sequence for ${matchKey}`);
      this.getMatch(matchKey).then((match: Match) => {
        logger.info(`Successfully prestarted match ${match.matchKey}`);
        this.resetScores(match);
        ScoreManager.match = match;
        this._timer.mode = MatchMode.PRESTART;
        this._hasPrestarted = true;
        this._currentMatchKey = match.matchKey;
        this._currentFieldNumber = match.fieldNumber;
        this._currentVideoID = 1; // Universal Match Preview Screen
        this._mode = "PRESTART";
        this._server.to("scoring").emit("prestart-response", null, ScoreManager.getJSON());
        this._server.to("referee").emit("data-update", ScoreManager.matchMetadata.toJSON());
        this._server.to("scoring").emit("control-update", PACKET_PRESTART);
      }).catch((reason: any) => {
        client.send("prestart-response", reason, null);
      });
    });
    client.on("prestart-cancel", () => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'prestart-cancel', required_priv: 'can_control_match'});
      this._currentVideoID = 1;
      this._hasPrestarted = false;
      this._mode = "UNDEFINED";
      this._server.to("scoring").emit("prestart-cancel");
      this._server.to("scoring").emit("control-update", PACKET_RESET);
    });
    client.on("commit-scores", (matchKey: string, updateDisplay?: boolean) => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'commit-scores', required_priv: 'can_control_match'});
      const updateAudience: boolean = updateDisplay ? updateDisplay : false;
      this.getMatch(matchKey).then((match: Match) => {
        ScoreManager.match = match;
        this._currentVideoID = 3; // Universal Match Results Screen
        this._server.to("scoring").emit("commit-scores-response", null, ScoreManager.getJSON(), updateAudience);
        this._timer.mode = MatchMode.RESET;
        this._hasCommittedScore = true;
        this._server.to("scoring").emit("control-update", PACKET_COMMIT);
        logger.info(`Committing scores for ${matchKey}. The audience display ${updateDisplay ? 'will' : 'will not'} be updated.`);
      }).catch((reason: any) => {
        client.send("commit-scores-response", reason, null);
      });
    });
    client.on("start", () => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'start', required_priv: 'can_control_match'});
      if (!this._timer.inProgress()) {
        this._server.to("scoring").emit("control-update", PACKET_START);
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
    client.on("get-timer", () => {
      this._server.to('scoring').emit("get-timer-response", this._timer.mode, this._timer.timeLeft, this._timer.modeTimeLeft, this._timer.matchConfig);
    });
    client.on("abort", () => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'abort', required_priv: 'can_control_match'});
      if (this._timer.inProgress()) {
        this._server.to("scoring").emit("control-update", PACKET_ABORT);
        this._timer.abort();
      }
    });
    client.on("update-timer", (timerJSON: any) => {
      if(!user || (user && !user.canControlEvent)) return client.emit('Unauthorized', {event: 'update-timer', required_priv: 'can_control_event'});
      if (!this._timer.inProgress()) {
        if (typeof timerJSON.delay_time !== "undefined") {
          this._timer.matchConfig.delayTime = timerJSON.delay_time;
        }
        if (typeof timerJSON.auto_time !== "undefined") {
          this._timer.matchConfig.autoTime = timerJSON.auto_time;
        }
        if (typeof timerJSON.transition_time !== "undefined") {
          this._timer.matchConfig.transitionTime = timerJSON.transition_time;
        }
        if (typeof timerJSON.tele_time !== "undefined") {
          this._timer.matchConfig.teleTime = timerJSON.tele_time;
        }
        if (typeof timerJSON.end_time !== "undefined") {
          this._timer.matchConfig.endTime = timerJSON.end_time;
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
    client.on("control-update", (controlPacket: IFieldControlPacket) => {
      if(!user || (user && !user.canControlMatch)) return client.emit('Unauthorized', {event: 'control-update', required_priv: 'can_control_match'});
      logger.info(`Sending field control packet with ${controlPacket.messages.length} messages.`);
      this._server.to("scoring").emit("control-update", controlPacket);
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

  private resetScores(match: Match) {
    match.redScore = 0;
    match.redMinPen = 0;
    match.redMajPen = 0;
    match.blueScore = 0;
    match.blueMinPen = 0;
    match.blueMajPen = 0;
    match.result = 0; // NOT SCORED

    const seasonKey: string = match.matchKey.split("-")[0];
    match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey);
    for (const participant of match.participants) {
      participant.cardStatus = 0;
    }
  }

  get name(): string {
    return this._name;
  }

  private updateInterval(id: any, red: boolean, scoreType: number): void {
    if (this._ledTimers[id] === null) {
      this._ledTimes[id] = 1.0;
      this._ledTimers[id] = global.setInterval(() => {
        if (this._ledTimes[id] <= 0.0) {
          global.clearInterval(this._ledTimers[id]);
          this._ledTimers[id] = null;
          if (red && scoreType === 0) {
            this._server.to("scoring").emit("control-update", PACKET_RED_TOP_RESET);
          } else if (red && scoreType === 1) {
            this._server.to("scoring").emit("control-update", PACKET_RED_MID_RESET);
          } else if (red && scoreType === 2) {
            this._server.to("scoring").emit("control-update", PACKET_RED_BOT_RESET);
          } else if (!red && scoreType === 0) {
            this._server.to("scoring").emit("control-update", PACKET_BLUE_TOP_RESET);
          } else if (!red && scoreType === 1) {
            this._server.to("scoring").emit("control-update", PACKET_BLUE_MID_RESET);
          } else if (!red && scoreType === 2) {
            this._server.to("scoring").emit("control-update", PACKET_BLUE_BOT_RESET);
          }
        } else {
          this._ledTimes[id] -= 0.25;
        }
      }, 250);
    } else {
      this._ledTimes[id] = 1.0;
    }
  }
}
