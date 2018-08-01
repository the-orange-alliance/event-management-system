import {MatchState} from "../../../shared/models/MatchState";
import Match from "../../../shared/models/Match";
import EMSProvider from "../../../shared/providers/EMSProvider";
import HttpError from "../../../shared/models/HttpError";
import SocketProvider from "../../../shared/providers/SocketProvider";
import {EMSEventTypes} from "../../../shared/AppTypes";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import EnergyImpactMatchDetails from "../../../shared/models/EnergyImpactMatchDetails";
import MatchDetails from "../../../shared/models/MatchDetails";

const PRESTART_ID = 0;
const AUDIENCE_ID = 1;
const START_ID = 2;
const ABORT_ID = 3;
const COMMIT_ID = 4;

class MatchFlowController {
  private static _instance: MatchFlowController;

  public static getInstance(): MatchFlowController {
    if (typeof MatchFlowController._instance === "undefined") {
      MatchFlowController._instance = new MatchFlowController();
    }
    return MatchFlowController._instance;
  }

  private constructor() {}

  public prestart(match: Match): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.makeActiveMatch(match).then(() => {
        SocketProvider.send("prestart", match.matchKey);
        resolve();
      }).catch((error: HttpError) => {
        reject(error);
      })
    });
  }

  public setAudienceDisplay(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      SocketProvider.send("request-video", 2);
      resolve();
    });
  }

  public startMatch(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      SocketProvider.emit("start");
      resolve();
    });
  }

  public abortMatch(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      SocketProvider.emit("abort");
      resolve();
    });
  }

  public commitScores(match: Match, eventType: EMSEventTypes): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postMatchResults(match).then(() => {
        if (match.tournamentLevel > 0) {
          setTimeout(() => {
            EMSProvider.calculateRankings(match.tournamentLevel, eventType).then(() => {
              SocketProvider.send("commit-scores", match.matchKey);
              resolve();
            }).catch((rankError: HttpError) => {
              reject(rankError);
            });
          }, 500);
        } else {
          SocketProvider.send("commit-scores", match.matchKey);
          resolve();
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getMatchResults(matchKey: string): Promise<Match> {
    return new Promise<Match>((resolve, reject) => {
      const promises: Array<Promise<any>> = [];
      promises.push(EMSProvider.getMatch(matchKey));
      promises.push(EMSProvider.getMatchDetails(matchKey));
      promises.push(EMSProvider.getMatchParticipantTeams(matchKey));
      Promise.all(promises).then((values: any[]) => {
        const match: Match = new Match().fromJSON(values[0].data.payload[0]);
        match.matchDetails = this.getDetailsFromSeasonKey(match.matchKey.split("-")[0]).fromJSON(values[1].data.payload[0]);
        match.participants = values[2].data.payload.map((json: any) => new MatchParticipant().fromJSON(json));
        resolve(match);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getDisabledStates(matchState: MatchState): boolean[] {
    const states: boolean[] = [false, false, false, false, false];
    switch (matchState) {
      case MatchState.PRESTART_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.PRESTART_IN_PROGRESS:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.PRESTART_COMPLETE:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = false;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.AUDIENCE_DISPLAY_SET:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = false;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = false;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_NOT_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_IN_PROGRESS:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = false;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_COMPLETE:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = false;
        break;
      case MatchState.MATCH_ABORTED:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      default:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
    }
    return states;
  }

  private makeActiveMatch(match: Match): Promise<any> {
    return EMSProvider.putActiveMatch(match);
  }

  private postMatchResults(match: Match): Promise<any> {
    const promises: Array<Promise<any>> = [];
    promises.push(EMSProvider.putMatchResult(match));
    promises.push(EMSProvider.putMatchDetails(match.matchDetails));
    promises.push(EMSProvider.putMatchParticipants(match.participants));
    return Promise.all(promises);
  }

  private getDetailsFromSeasonKey(seasonKey: string): MatchDetails {
    switch (seasonKey) {
      case "2018":
        return new EnergyImpactMatchDetails();
      default:
        return new EnergyImpactMatchDetails();
    }
  }
}

export default MatchFlowController.getInstance();