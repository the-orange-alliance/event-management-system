import {
  EMSProvider, Event, EventType, FGCProvider, HttpError, Match, MatchDetails, MatchParticipant, Ranking,
  Team
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
          console.log(participant);
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
            resolve(null);
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
      const tournamentKey: string = matches[0].matchKey.split("-")[3].substring(0, 2);
      FGCProvider.deleteMatchData(eventKey, matches[0].tournamentLevel, matches[0].tournamentLevel > Match.QUALIFICATION_LEVEL ? tournamentKey : undefined).then(() => {
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
            resolve(null);
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
      const seasonKey: string = match.matchKey.split("-")[0];
      Promise.all(promises).then(() => {
        if (match.tournamentLevel > 0 && match.tournamentLevel < 10) {
          FGCProvider.deleteRankingsByLevel(eventKey, match.tournamentLevel).then(() => {
            setTimeout(() => {
              EMSProvider.getRankings(getEventTypeFromKey(seasonKey)).then((rankings: Ranking[]) => {
                if (rankings.length > 0) {
                  FGCProvider.postRankingsByLevel(eventKey, rankings, match.tournamentLevel).then(() => {
                    resolve(null);
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
          resolve(null);
        }
      }).catch((error: HttpError) => {
        reject(error);
      });
    });
  }

}

function getEventTypeFromKey(seasonKey: string): EventType | undefined {
  switch (seasonKey) {
    case "2018":
      return "fgc_2018";
    case "2019":
      return "fgc_2019";
    case "20":
      return "frc_20";
    default:
      return undefined;
  }
}

export default FGCUploadedManager.getInstance();
