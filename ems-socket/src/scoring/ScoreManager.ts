import Match from "../shared/Match";
import MatchDetails from "../shared/MatchDetails";
import MatchParticipant from "../shared/MatchParticipant";

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

  public reset(matchKey: string) {
    this._match = new Match();
    this._match.matchKey = matchKey;
    this._match.matchDetailKey = matchKey + "D";
  }

  public createDetails() {
    const seasonKey: number = parseInt(this._match.matchKey.split("-")[0],  10);
    this._match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey);
    this._match.matchDetails.matchKey = this._match.matchKey;
    this._match.matchDetails.matchDetailKey = this._match.matchKey + "D";
  }

  public updateMatch(matchJSON: any) {
    const seasonKey: number = parseInt(this._match.matchKey.split("-")[0],  10);
    this._match = new Match().fromJSON(matchJSON);
    this._match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
    if (typeof matchJSON.participants !== "undefined") {
      this._match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));
    }
    this._match.redScore = this._match.matchDetails.getRedScore(this._match.blueMinPen, this._match.blueMajPen);
    this._match.blueScore = this._match.matchDetails.getBlueScore(this._match.redMinPen, this._match.redMajPen);
  }

  get match(): Match {
    return this._match;
  }

  set match(value: Match) {
    this._match = value;
  }

}

export default ScoreManager.getInstance();