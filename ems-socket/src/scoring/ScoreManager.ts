import {IPostableObject, Match, MatchParticipant, OceanOpportunitiesMatchDetails, RoverRuckusRefereeData} from "@the-orange-alliance/lib-ems";

class ScoreManager {
  private static _instance: ScoreManager;

  private _match: Match;
  private _matchMetadata: IPostableObject;

  public static getInstance(): ScoreManager {
    if (typeof ScoreManager._instance === "undefined") {
      ScoreManager._instance = new ScoreManager();
    }
    return ScoreManager._instance;
  }

  private constructor() {
    this._match = new Match();
    this._matchMetadata = new Match();
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
    this.handleGameSpecifics();
  }

  public updateMatchMetaData(dataJSON: any) {
    this._matchMetadata = this.getMetadataFromMatchKey(this._match.matchKey).fromJSON(dataJSON);
  }

  public getJSON(): any {
    const matchJSON: any = this.match.toJSON();
    const detailsJSON: any = this.match.matchDetails.toJSON();
    const participantsJSON: any = this.match.participants.map((p: MatchParticipant) => p.toJSON());
    matchJSON.details = detailsJSON;
    matchJSON.participants = participantsJSON;
    return matchJSON;
  }

  private handleGameSpecifics() {
    const seasonKey: string = this._match.matchKey.split("-")[0];
    switch (seasonKey){
      case "2019":
        if (this._match.tournamentLevel > Match.QUALIFICATION_LEVEL) {
          const details: OceanOpportunitiesMatchDetails = (this._match.matchDetails as OceanOpportunitiesMatchDetails);
          this._match.redScore += details.coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
          this._match.blueScore += details.coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
        }
        break;
    }
  }

  private getMetadataFromMatchKey(matchKey: string): IPostableObject {
    const seasonKey: string = matchKey.split("-")[0];
    switch (seasonKey) {
      case "1819":
        return new RoverRuckusRefereeData();
      default:
        return new Match();
    }
  }

  get match(): Match {
    return this._match;
  }

  set match(value: Match) {
    this._match = value;
    // this._matchMetadata = this.getMetadataFromMatchKey(value.matchKey);
  }

  get matchMetadata(): IPostableObject {
    return this._matchMetadata;
  }

  set matchMetadata(value: IPostableObject) {
    this._matchMetadata = value;
  }
}

export default ScoreManager.getInstance();