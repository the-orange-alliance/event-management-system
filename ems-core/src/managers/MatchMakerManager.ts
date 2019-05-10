import {AppError, Match, MatchParticipant, TournamentType} from "@the-orange-alliance/lib-ems";

const ipcRenderer = (window as any).require("electron").ipcRenderer;

interface IMatchMakerOptions {
  teams: number,
  rounds: number,
  quality: string,
  teamsPerAlliance: number,
  fields: number,
  eventKey: string,
  type: TournamentType
}

class MatchMakerManager {
  private static _instance: MatchMakerManager;

  public static getInstance(): MatchMakerManager {
    if (typeof MatchMakerManager._instance === "undefined") {
      MatchMakerManager._instance = new MatchMakerManager();
    }
    return MatchMakerManager._instance;
  }

  private constructor() {}

  public execute(options: IMatchMakerOptions): Promise<Match[]> {
    return new Promise<any>((resolve, reject) => {
      ipcRenderer.once("match-maker-response", (event: any, error: any, data: any) => {
        if (error) {
          reject(new AppError(1500, "MATCH_MAKER_RUN", error));
        } else {
          const matches: Match[] = [];
          for (const matchJSON of data) {
            const match = new Match().fromJSON(matchJSON);
            const participants: MatchParticipant[] = [];
            for (const participantJSON of matchJSON.participants) {
              participants.push(new MatchParticipant().fromJSON(participantJSON));
            }
            match.redScore = -1;
            match.blueScore = -1;
            match.redMinPen = 0;
            match.redMajPen = 0;
            match.blueMinPen = 0;
            match.blueMajPen = 0;
            match.participants = participants;
            matches.push(match);
          }
          resolve(matches);
        }
      });
      ipcRenderer.send("match-maker", options);
    });
  }

  public createTeamList(scheduleType: TournamentType, teamList: number[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      ipcRenderer.once("match-maker-teams-response", (event: any, error: any, data: any) => {
        if (error) {
          reject(new AppError(1501, "MATCH_MAKER_TEAMS", error));
        } else {
          resolve(data);
        }
      });
      ipcRenderer.send("match-maker-teams", scheduleType, teamList);
    });
  }

}

export default MatchMakerManager.getInstance();