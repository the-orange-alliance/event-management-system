import Team from "../models/Team";
import TOAProvider from "../providers/TOAProvider";
import HttpError from "../models/HttpError";
import TOAEventParticipant from "../models/toa/TOAEventParticipant";
import TOAEventParticipantAdapter from "../adapters/TOAEventParticipantAdapter";

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

  public postMatchSchedule(eventKey: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      TOAProvider.deleteAllMatchData(eventKey).then(() => {
        resolve();
      }).catch((deleteError: HttpError) => {
        reject(deleteError);
      });
    });
  }

}

export default TOAUploadManager.getInstance();