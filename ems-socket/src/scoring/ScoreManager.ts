import BasicMatch, {MatchDetails} from "../shared/BasicMatch";

class ScoreManager {
  private static _instance: ScoreManager;

  private _match: BasicMatch;

  private constructor() {
    this._match = new BasicMatch();
  }

  public static getInstance(): ScoreManager {
    if (typeof ScoreManager._instance === "undefined") {
      ScoreManager._instance = new ScoreManager();
    }
    return ScoreManager._instance;
  }

  public getDetails(alliance: string): MatchDetails {
    if (alliance === "red") {
      return this._match.redDetails;
    } else if (alliance === "blue") {
      return this._match.blueDetails;
    } else {
      return this._match.redDetails;
    }
  }

  public resetMatch(): void {
    this._match = new BasicMatch();
  }

  get match(): BasicMatch {
    return this._match;
  }

}

export default ScoreManager.getInstance();