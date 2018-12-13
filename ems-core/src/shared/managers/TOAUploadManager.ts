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