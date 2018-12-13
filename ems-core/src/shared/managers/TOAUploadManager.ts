import Team from "../models/Team";
import TOAProvider from "../providers/TOAProvider";
import HttpError from "../models/HttpError";
import TOAEventParticipant from "../models/toa/TOAEventParticipant";
import TOAEventParticipantAdapter from "../adapters/TOAEventParticipantAdapter";
import Match from "../models/Match";
import TOAMatch from "../models/toa/TOAMatch";
import TOAMatchAdapter from "../adapters/TOAMatchAdapter";
import MatchDetails from "../models/MatchDetails";
import TOAMatchDetails from "../models/toa/TOAMatchDetails";
import TOAMatchDetailsAdapter from "../adapters/TOAMatchDetailsAdapter";
import TOAMatchParticipant from "../models/toa/TOAMatchParticipant";
import TOAMatchParticipantAdapter from "../adapters/TOAMatchParticipantAdapter";
import MatchParticipant from "../models/MatchParticipant";
import EMSProvider from "../providers/EMSProvider";
import {AxiosResponse} from "axios";
import Ranking from "../models/Ranking";
import TOARanking from "../models/toa/TOARanking";
import TOARankingAdapter from "../adapters/TOARankingAdapter";

class TOAUploadManager {
  private static _instance: TOAUploadManager;

  public static getInstance(): TOAUploadManager {
    if (typeof TOAUploadManager._instance === "undefined") {
      TOAUploadManager._instance = new TOAUploadManager();
    }
    return TOAUploadManager._instance;
  }

  private constructor() {}

  public postEventParticipants(eventKey: string, teams: Team[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      TOAProvider.deleteTeams(eventKey).then(() => {
        setTimeout(() => {
          const participants: TOAEventParticipant[] = teams.map((t: Team) => new TOAEventParticipantAdapter(t).get());
          TOAProvider.postEventParticipants(eventKey, participants).then(() => {
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
      TOAProvider.deleteMatchData(eventKey, getPartialFromLevel(matches[0].tournamentLevel)).then(() => {
        setTimeout(() => {
          const toaMatches: TOAMatch[] = matches.map((m: Match) => {
            const details: MatchDetails = Match.getDetailsFromSeasonKey(parseInt(m.matchKey.split("-")[0], 10));
            return new TOAMatchAdapter(m, details).get();
          });
          const toaDetails: TOAMatchDetails[] = matches.map((m: Match) => {
            const details: MatchDetails = Match.getDetailsFromSeasonKey(parseInt(m.matchKey.split("-")[0], 10));
            return new TOAMatchDetailsAdapter(m, details).get();
          });
          const toaParticipants: TOAMatchParticipant[] = [];
          for (const match of matches) {
            for (const participant of match.participants) {
              toaParticipants.push(new TOAMatchParticipantAdapter(participant).get());
            }
          }
          const promises: Array<Promise<any>> = [];
          promises.push(TOAProvider.postMatches(eventKey, toaMatches));
          promises.push(TOAProvider.postMatchDetails(eventKey, toaDetails));
          promises.push(TOAProvider.postMatchParticipants(eventKey, toaParticipants));
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
      const toaMatch: TOAMatch = new TOAMatchAdapter(match, match.matchDetails).get();
      const toaDetails: TOAMatchDetails = new TOAMatchDetailsAdapter(match, match.matchDetails).get();
      const toaParticipants: TOAMatchParticipant[] = match.participants.map((p: MatchParticipant) => new TOAMatchParticipantAdapter(p).get());
      const promises: Array<Promise<any>> = [];
      promises.push(TOAProvider.putMatchResults(eventKey, toaMatch));
      promises.push(TOAProvider.putMatchDetails(eventKey, toaDetails));
      promises.push(TOAProvider.putMatchParticipants(eventKey, toaParticipants));
      Promise.all(promises).then(() => {
        if (match.tournamentLevel > 0 && match.tournamentLevel < 10) {
          TOAProvider.deleteRankings(eventKey).then(() => {
            setTimeout(() => {
              EMSProvider.getRankings().then((rankRes: AxiosResponse) => {
                if (rankRes.data && rankRes.data.payload && rankRes.data.payload.length > 0) {
                  const seasonKey: string = eventKey.split("-")[0];
                  const rankings: Ranking[] = rankRes.data.payload.map((rankJSON: any) => TOARankingAdapter.getRankingFromSeasonKey(seasonKey).fromJSON(rankJSON));
                  const toaRankings: TOARanking[] = rankings.map((r: Ranking) => new TOARankingAdapter(r).get());
                  TOAProvider.postRankings(eventKey, toaRankings).then(() => {
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

function getPartialFromLevel(tournamentLevel: number): string {
  if (tournamentLevel === 0) {
    return "P";
  } else if (tournamentLevel === 1) {
    return "Q";
  } else if (tournamentLevel >= 10) {
    return "E";
  } else {
    return "";
  }
}

export default TOAUploadManager.getInstance();