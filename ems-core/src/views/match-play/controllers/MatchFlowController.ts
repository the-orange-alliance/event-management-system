import {MatchState} from "../../../shared/models/MatchState";
import Match from "../../../shared/models/Match";
import EMSProvider from "../../../shared/providers/EMSProvider";
import HttpError from "../../../shared/models/HttpError";
import SocketProvider from "../../../shared/providers/SocketProvider";
import {AllianceColors, EliminationsFormats} from "../../../shared/AppTypes";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import EnergyImpactMatchDetails from "../../../shared/models/EnergyImpactMatchDetails";
import MatchDetails from "../../../shared/models/MatchDetails";
import Team from "../../../shared/models/Team";
import {AxiosResponse} from "axios";
import EventConfiguration from "../../../shared/models/EventConfiguration";

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
        // Reset all of the scoring variables to show a new match is about to start...
        // TODO - Maybe store this match, and if prestart is canceled, restore that match.
        match.redScore = 0;
        match.redMinPen = 0;
        match.redMajPen = 0;
        match.blueScore = 0;
        match.blueMinPen = 0;
        match.blueMajPen = 0;
        match.matchDetails = this.getDetailsFromSeasonKey(match.matchKey.split("-")[0]);
        for (const participant of match.participants) {
          participant.cardStatus = 0;
        }
        SocketProvider.sendTwo("prestart", match.matchKey, match.fieldNumber);
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

  public commitScores(match: Match, config: EventConfiguration): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postMatchResults(match).then(() => {
        if (match.tournamentLevel > 0 && match.tournamentLevel < 10) {
          setTimeout(() => {
            EMSProvider.calculateRankings(match.tournamentLevel, config.eventType).then(() => {
              SocketProvider.send("commit-scores", match.matchKey);
              resolve();
            }).catch((rankError: HttpError) => {
              reject(rankError);
            });
          }, 500);
        } else {
          setTimeout(() => {
            SocketProvider.send("commit-scores", match.matchKey);
            resolve();
          }, 250);
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
        for (let i = 0; i < match.participants.length; i++) {
          match.participants[i].team = new Team().fromJSON(values[2].data.payload[i]);
        }
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

  public checkForAdvancements(tournamentLevel: number, format: EliminationsFormats): Promise<Match[]> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getMatches(tournamentLevel).then((response: AxiosResponse) => {
        if (response.data && response.data.payload && response.data.payload.length > 0) {
          const matches: Match[] = response.data.payload.map((matchJSON: any) => new Match().fromJSON(matchJSON));
          const advancementWins = this.getWinsFromFormat(format);
          let redWins: number = 0;
          let blueWins: number = 0;
          for (const match of matches) {
            if (match.redScore !== null && match.blueScore !== null) {
              if (match.redScore > match.blueScore) {
                redWins++;
              } else if (match.redScore < match.blueScore) {
                blueWins++;
              }
            }
          }
          const participants: MatchParticipant[] = [];
          for (let i = 0; i < response.data.payload[0].participants.split(",").length; i++) {
            const participant: MatchParticipant = new MatchParticipant();
            participant.allianceKey = response.data.payload[0].alliance_keys.split(",")[i];
            participant.teamKey = parseInt(response.data.payload[0].participants.split(",")[i], 10);
            participant.surrogate = response.data.payload[0].surrogates.split(",")[i] === "1";
            participant.station = parseInt(response.data.payload[0].stations.split(",")[i], 10);
            participants.push(participant);
          }
          if (redWins >= advancementWins) {
            console.log("Advancing red to the next series...");
            this.advanceAlliance(tournamentLevel, participants.filter((participant) => participant.station < 20)).then(() => {
              setTimeout(() => {
                this.fetchElimsMatches().then((elimsMatches: Match[]) => {
                  resolve(elimsMatches);
                }).catch((elimsError: HttpError) => {
                  reject(elimsError);
                });
              }, 250);
            }).catch((advanceError: HttpError) => {
              reject(advanceError);
            });
          } else if (blueWins >= advancementWins) {
            console.log("Advancing blue to the next series...");
            this.advanceAlliance(tournamentLevel, participants.filter((participant) => participant.station >= 20)).then(() => {
              setTimeout(() => {
                this.fetchElimsMatches().then((elimsMatches: Match[]) => {
                  resolve(elimsMatches);
                }).catch((elimsError: HttpError) => {
                  reject(elimsError);
                });
              }, 250);
            }).catch((advanceError: HttpError) => {
              reject(advanceError);
            });
          }
        }
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

  private advanceAlliance(tournamentLevel: number, alliance: MatchParticipant[]): Promise<any> {
    switch (tournamentLevel) {
      case 10:
        // Advance to RED of 20
        return this.makeAndPostParticipants(20, alliance, "Red");
      case 11:
        // Advance to BLUE of 20
        return this.makeAndPostParticipants(20, alliance, "Blue");
      case 12:
        // Advance to RED of 21
        return this.makeAndPostParticipants(21, alliance, "Red");
      case 13:
        // Advance to BLUE of 21
        return this.makeAndPostParticipants(21, alliance, "Blue");
      case 14:
        // Advance to RED of 22
        return this.makeAndPostParticipants(22, alliance, "Red");
      case 15:
        // Advance to BLUE of 22
        return this.makeAndPostParticipants(22, alliance, "Blue");
      case 16:
        // Advance to RED of 23
        return this.makeAndPostParticipants(23, alliance, "Red");
      case 17:
        // Advance to BLUE of 23
        return this.makeAndPostParticipants(23, alliance, "Blue");
      case 20:
        // Advance to RED of 30
        return this.makeAndPostParticipants(30, alliance, "Red");
      case 21:
        // Advance to BLUE of 30
        return this.makeAndPostParticipants(30, alliance, "Blue");
      case 22:
        // Advance to RED of 31
        return this.makeAndPostParticipants(31, alliance, "Red");
      case 23:
        // Advance to BLUE of 31
        return this.makeAndPostParticipants(31, alliance, "Blue");
      case 30:
        // Advance to RED of 40
        return this.makeAndPostParticipants(40, alliance, "Red");
      case 31:
        // Advance to BLUE of 40
        return this.makeAndPostParticipants(40, alliance, "Blue");
      default:
        return new Promise<any>((resolve, reject) => reject());
    }
  }

  private makeAndPostParticipants(advancementLevel: number, alliance: MatchParticipant[], allianceColor: AllianceColors): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getMatchResults(advancementLevel).then((response: AxiosResponse) => {
        if (response.data && response.data.payload && response.data.payload.length > 0) {
          const participants: MatchParticipant[] = [];
          const matches: Match[] = response.data.payload.map((matchJSON: any) => new Match().fromJSON(matchJSON));
          for (const match of matches) {
            for (let i = 0; i < alliance.length; i++) {
              const participant: MatchParticipant = new MatchParticipant().fromJSON(alliance[i].toJSON()); // Essentially de-referencing
              participant.matchKey = match.matchKey;
              if (allianceColor === "Red") {
                participant.station = 10 + i;
              } else {
                participant.station = 20 + i;
              }
              if (participant.station < 20) {
                participant.matchParticipantKey = match.matchKey + "-T" + (participant.station - 9);
              } else {
                participant.matchParticipantKey = match.matchKey + "-T" + ((participant.station - 19) + (alliance.length));
              }
              participants.push(participant);
            }
          }
          EMSProvider.postMatchScheduleParticipants(participants).then(() => {
            resolve();
          }).catch(() => {
            EMSProvider.putMatchParticipants(participants).then(() => {
              resolve();
            }).catch((error: HttpError) => {
              reject(error);
            });
          });
        } else {
          reject(new HttpError(500, "ERR_NO_RESULTS", "There are no match results for " + advancementLevel + "."));
        }
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

  private fetchElimsMatches(): Promise<Match[]> {
    return new Promise<Match[]>((resolve, reject) => {
      EMSProvider.getMatches("elims").then((elimsMatchesResposne: AxiosResponse) => {
        if (elimsMatchesResposne.data && elimsMatchesResposne.data.payload && elimsMatchesResposne.data.payload.length > 0) {
          const elimsMatches: Match[] = [];
          for (const matchJSON of elimsMatchesResposne.data.payload) {
            const match: Match = new Match().fromJSON(matchJSON);
            const participants: MatchParticipant[] = [];
            for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
              const participant: MatchParticipant = new MatchParticipant();
              participant.allianceKey = matchJSON.alliance_keys.split(",")[i];
              participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
              participant.matchKey = match.matchKey;
              participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
              participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
              participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
              participants.push(participant);
            }
            match.participants = participants;
            elimsMatches.push(match);
          }
          resolve(elimsMatches);
        } else {
          reject(new HttpError(500, "ERR_NO_RESULTS", "No eliminations matches were found."));
        }
      });
    });
  }

  private makeActiveMatch(match: Match): Promise<any> {
    return EMSProvider.putActiveMatch(match);
  }

  private postMatchResults(match: Match): Promise<any> {
    match.matchDetails.matchKey = match.matchKey;
    match.matchDetails.matchDetailKey = match.matchDetailKey;
    for (const participant of match.participants) {
      if (typeof participant.cardStatus === "undefined") {
        participant.cardStatus = 0;
      }
    }
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

  private getWinsFromFormat(format: EliminationsFormats): number {
    switch (format) {
      case "bo1":
        return 1;
      case "bo3":
        return 2;
      case "bo5":
        return 3;
      default:
        return 1;
    }
  }
}

export default MatchFlowController.getInstance();
