import Match from "../shared/Match";
import MatchDetails from "../shared/MatchDetails";

class ScoreManager {
  private static _instance: ScoreManager;

  private _match: Match;

  public static getInstance(): ScoreManager {
    if (typeof ScoreManager._instance === "undefined") {
      ScoreManager._instance = new ScoreManager();
    }
    return ScoreManager._instance;
  }

  private constructor() {
    this._match = new Match();
  }

  public reset() {
    this._match = new Match();
  }

  get match(): Match {
    return this._match;
  }

  set match(value: Match) {
    this._match = value;
  }

}

export default ScoreManager.getInstance();