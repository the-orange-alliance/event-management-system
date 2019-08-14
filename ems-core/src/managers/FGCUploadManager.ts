import {
  EMSProvider, Event, FGCProvider, HttpError, Match, MatchDetails, MatchParticipant, Ranking, Team
} from "@the-orange-alliance/lib-ems";
import TeamValidator from "../validators/TeamValidator";

class FGCUploadedManager {
  private static _instance: FGCUploadedManager;

  public static getInstance(): FGCUploadedManager {
    if (typeof FGCUploadedManager._instance === "undefined") {
      FGCUploadedManager._instance = new FGCUploadedManager();
    }
    return FGCUploadedManager._instance;
  }

  private constructor() {}

  public getEvent(eventKey: string): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
      FGCProvider.getEvent(eventKey).then((event: Event) => {
        if (event && event.eventKey && event.eventKey.length > 0) {
          resolve(event);
        } else {
          reject();
        }
      }).catch((error: HttpError) => {
        reject(error);
      });

    });
  }

  public getTeams(eventKey: string): Promise<Team[]> {
    return new Promise<Team[]>((resolve, reject) => {
      FGCProvider.getTeams(eventKey).then((participants: Team[]) => {
        const teams: Team[] = [];
        for (const participant of participants) {
          const validator: TeamValidator = new TeamValidator(participant);
          validator.update(participant);
          if (validator.isValid) {
            teams.push(participant);
          }
        }
        resolve(teams);
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

  public postEventParticipants(eventKey: string, teams: Team[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      FGCProvider.deleteTeams(eventKey).then(() => {
        setTimeout(() => {
          FGCProvider.postEventParticipants(eventKey, teams).then(() => {
            resolve();
          }).catch((postError: HttpError) => {
            reject(postError);
          });
        }, 500);
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

  public postMatchSchedule(eventKey: string, matches: Match[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      FGCProvider.deleteMatchData(eventKey, matches[0].tournamentLevel).then(() => {
        setTimeout(() => {
          const fgcMatches: Match[] = matches.map((m: Match) => m);
          const fgcDetails: MatchDetails[] = matches.map((m: Match) => new MatchDetails().fromJSON({match_key: m.matchKey, match_detail_key: m.matchDetailKey}));
          const fgcParticipants: MatchParticipant[] = [];
          for (const match of matches) {
            for (const participant of match.participants) {
              fgcParticipants.push(participant);
            }
          }
          const promises: Array<Promise<any>> = [];
          promises.push(FGCProvider.postMatches(eventKey, fgcMatches));
          promises.push(FGCProvider.postMatchDetails(eventKey, fgcDetails));
          promises.push(FGCProvider.postMatchParticipants(eventKey, fgcParticipants));
          Promise.all(promises).then(() => {
            resolve();
          }).catch((error: HttpError) => {
            reject(error);
          });
        }, 500);
      }).catch((deleteError: HttpError) => {
        reject(deleteError);
      });
    });
  }

  public postMatchResults(eventKey: string, match: Match): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const promises: Array<Promise<any>> = [];
      promises.push(FGCProvider.putMatchResults(eventKey, match));
      promises.push(FGCProvider.putMatchDetails(eventKey, match.matchDetails));
      promises.push(FGCProvider.putMatchParticipants(eventKey, match.participants));
      Promise.all(promises).then(() => {
        if (match.tournamentLevel > 0 && match.tournamentLevel < 10) {
          FGCProvider.deleteRankings(eventKey).then(() => {
            setTimeout(() => {
              EMSProvider.getRankings().then((rankings: Ranking[]) => {
                if (rankings.length > 0) {
                  FGCProvider.postRankings(eventKey, rankings).then(() => {
                    resolve();
                  }).catch((postError: HttpError) => {
                    reject(postError);
                  });
                } else {
                  reject();
                }
              }).catch((rankError: HttpError) => {
                reject(rankError);
              });
            }, 500);
          }).catch((deleteError: HttpError) => {
            reject(deleteError);
          });
        } else {
          resolve();
        }
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

}
//
// function getPartialFromLevel(tournamentLevel: number): string {
//   if (tournamentLevel === 0) {
//     return "P";
//   } else if (tournamentLevel === 1) {
//     return "Q";
//   } else if (tournamentLevel >= 10) {
//     return "E";
//   } else {
//     return "";
//   }
// }

export default FGCUploadedManager.getInstance();