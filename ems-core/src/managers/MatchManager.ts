import {AllianceColor, SeriesType, EMSProvider, Event, EventConfiguration, HttpError, Match, MatchParticipant,
  MatchState, SocketProvider
} from "@the-orange-alliance/lib-ems";

const PRESTART_ID = 0;
const AUDIENCE_ID = 1;
const START_ID = 2;
const ABORT_ID = 3;
const COMMIT_ID = 4;

class MatchManager {
  private static _instance: MatchManager;

  public static getInstance(): MatchManager {
    if (typeof MatchManager._instance === "undefined") {
      MatchManager._instance = new MatchManager();
    }
    return MatchManager._instance;
  }

  private constructor() {}

  public createTestMatch(event: Event, eventConfig: EventConfiguration): Promise<Match> {
    return new Promise<any>((resolve, reject) => {
      const match: Match = new Match();
      match.matchKey = event.eventKey + "-T001";
      match.matchDetailKey = event.eventKey + "-T001D";
      match.matchName = "Match Test";
      match.tournamentLevel = Match.TEST_LEVEL;
      match.fieldNumber = 1;
      match.participants = [];
      for (let i = 0; i < eventConfig.teamsPerAlliance; i++) {
        const redParticipant: MatchParticipant = new MatchParticipant();
        redParticipant.matchKey = match.matchKey;
        redParticipant.matchParticipantKey = match.matchKey + "-T" + (i + 1);
        redParticipant.station = (i + 11);
        redParticipant.teamKey = MatchParticipant.TEST_TEAM_KEY;

        const blueParticipant: MatchParticipant = new MatchParticipant();
        blueParticipant.matchKey = match.matchKey;
        blueParticipant.matchParticipantKey = match.matchKey + "-T" + (i + 1 + eventConfig.teamsPerAlliance);
        blueParticipant.station = (i + 21);
        blueParticipant.teamKey = MatchParticipant.TEST_TEAM_KEY;

        match.participants.push(redParticipant);
        match.participants.push(blueParticipant);
      }

      EMSProvider.postMatchSchedule([match]).then(() => {
        EMSProvider.postMatchScheduleParticipants(match.participants).then(() => {
          resolve(match);
        }).catch((partErr: HttpError) => reject(partErr));
      }).catch((matchErr: HttpError) => reject(matchErr));
    });
  }

  public prestart(match: Match, uploadTeams?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.makeActiveMatch(match, uploadTeams).then(() => {
        const seasonKey: string = match.matchKey.split("-")[0];
        // Reset all of the scoring variables to show a new match is about to start...
        // TODO - Maybe store this match, and if prestart is canceled, restore that match.
        match.redScore = 0;
        match.redMinPen = 0;
        match.redMajPen = 0;
        match.blueScore = 0;
        match.blueMinPen = 0;
        match.blueMajPen = 0;
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey);
        for (const participant of match.participants) {
          participant.cardStatus = 0;
        }
        SocketProvider.on("prestart-response", (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
        SocketProvider.emit("prestart", match.matchKey);
      }).catch((error: HttpError) => {
        reject(error);
      })
    });
  }

  public cancelPrestart(): void {
    SocketProvider.emit("prestart-cancel");
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

  public commitScores(match: Match, config: EventConfiguration, updateDisplay: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postMatchResults(match).then(() => {
        if (match.tournamentLevel > Match.PRACTICE_LEVEL) {
          setTimeout(() => {
            EMSProvider.calculateRankings(match.tournamentLevel, config.eventType).then(() => {
              SocketProvider.once("commit-scores-response", (err: any, data: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
              SocketProvider.emit("commit-scores", match.matchKey, updateDisplay);
              resolve();
            }).catch((rankError: HttpError) => {
              reject(rankError);
            });
          }, 500);
        } else {
          setTimeout(() => {
            SocketProvider.once("commit-scores-response", (err: any, data: any) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
            SocketProvider.emit("commit-scores", match.matchKey, updateDisplay);
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
      promises.push(EMSProvider.getMatchTeams(matchKey));
      Promise.all(promises).then((values: any[]) => {
        const match: Match = values[0];
        if (Array.isArray(values[1]) && values[1].length > 0) {
          match.matchDetails = values[1][0];
        }
        if (Array.isArray(values[2]) && values[2].length > 2) {
          match.participants = values[2];
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

  public checkForAdvancements(eventKey: string, tournamentId: number, tournamentLevel: number, format: SeriesType): Promise<Match[]> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getMatchesAndParticipants(`${eventKey}-E${tournamentId}`, tournamentLevel).then((matches: Match[]) => {
        if (matches.length > 0) {
          const advancementWins = this.getWinsFromFormat(format);
          let redWins: number = 0;
          let blueWins: number = 0;
          for (const match of matches) {
            if (match.redScore !== null && match.blueScore !== null) { // TODO - Use match.result
              if (match.redScore > match.blueScore) {
                redWins++;
              } else if (match.redScore < match.blueScore) {
                blueWins++;
              }
            }
          }
          const participants: MatchParticipant[] = matches[0].participants;
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

  private makeAndPostParticipants(advancementLevel: number, alliance: MatchParticipant[], allianceColor: AllianceColor): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const keyArgs: string[] = alliance[0].matchKey.split("-");
      const tournament: string = keyArgs[3].substring(0, 2);
      const keyPartial: string = `${keyArgs[0]}-${keyArgs[1]}-${keyArgs[2]}-${tournament}`;
      EMSProvider.getMatchesAndParticipants(keyPartial, advancementLevel).then((matches: Match[]) => {
        if (matches.length > 0) {
          const participants: MatchParticipant[] = [];
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
      EMSProvider.getMatchesAndParticipants("").then((matches: Match[]) => {
        if (matches.length > 0) {
          resolve(matches);
        } else {
          reject(new HttpError(500, "ERR_NO_RESULTS", "No eliminations matches were found."));
        }
      });
    });
  }

  private makeActiveMatch(match: Match, uploadTeams?: boolean): Promise<any> {
    if (uploadTeams) {
      return new Promise<any>((resolve, reject) => {
        EMSProvider.putActiveMatch(match).then(() => {
          EMSProvider.putMatchParticipants(match.participants).then(() => {
            resolve();
          }).catch((pError: HttpError) => reject(pError));
        }).catch((error: HttpError) => reject(error));
      });
    } else {
      return EMSProvider.putActiveMatch(match);
    }
  }

  private postMatchResults(match: Match): Promise<any> {
    match.matchDetails.matchKey = match.matchKey;
    match.matchDetails.matchDetailKey = match.matchDetailKey;
    for (const participant of match.participants) {
      if (typeof participant.cardStatus === "undefined"
        || (participant.cardStatus as any) === "null"
        || (participant.cardStatus) > 2
        || (isNaN(participant.cardStatus))
        || (participant.cardStatus) < 0) {
        participant.cardStatus = 0;
      }
    }

    if (match.tournamentLevel >= 10) {
      this.assignTeamCards(match.participants);
    }

    if (match.blueScore > match.redScore) {
      match.result = Match.RESULT_BLUE_WIN;
    } else if (match.blueScore === match.redScore) {
      match.result = Match.RESULT_TIE;
    } else {
      match.result = Match.RESULT_RED_WIN;
    }

    const promises: Array<Promise<any>> = [];
    promises.push(EMSProvider.putMatchResult(match));
    promises.push(EMSProvider.putMatchDetails(match.matchDetails));
    promises.push(EMSProvider.putMatchParticipants(match.participants));
    return Promise.all(promises);
  }

  private getWinsFromFormat(format: SeriesType): number {
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

  private assignTeamCards(participants: MatchParticipant[]) {
    for (let i = 0; i < participants.length / 2; i++) {
      if (participants[i].cardStatus > 0) {
        for (let j = 0; j < participants.length / 2; j++) {
          participants[j].cardStatus = participants[i].cardStatus;
        }
        break;
      }
    }
    for (let i = participants.length / 2; i < participants.length; i++) {
      if (participants[i].cardStatus > 0) {
        for (let j = participants.length / 2; j < participants.length; j++) {
          participants[j].cardStatus = participants[i].cardStatus;
        }
        break;
      }
    }
  }

}

export default MatchManager.getInstance();
