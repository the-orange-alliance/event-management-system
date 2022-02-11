import {
  InfiniteRechargeMatchDetails,
  IPostableObject,
  Match,
  MatchParticipant,
  OceanOpportunitiesMatchDetails, RapidReactMatchDetails,
  RoverRuckusRefereeData
} from "@the-orange-alliance/lib-ems";

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
    switch (seasonKey) {
      case "2019":
        if (this._match.tournamentLevel > Match.QUALIFICATION_LEVEL) {
          const details: OceanOpportunitiesMatchDetails = (this._match.matchDetails as OceanOpportunitiesMatchDetails);
          this._match.redScore += details.coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
          this._match.blueScore += details.coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
        }
        break;
      case "20":
        const details: InfiniteRechargeMatchDetails = this._match.matchDetails as InfiniteRechargeMatchDetails;
        const redAutoCells: number = details.redAutoInnerCells + details.redAutoOuterCells + details.redAutoBottomCells;
        const redTeleCells: number = details.redTeleInnerCells + details.redTeleOuterCells + details.redTeleBottomCells;

        if (details.redStage === 0) {
          details.redStageOneCells = redAutoCells + redTeleCells;
          details.redStageTwoCells = 0;
          details.redStageThreeCells = 0;
        } else if (details.redStage === 1) {
          details.redStageTwoCells = redAutoCells + redTeleCells - details.redStageOneCells;
          details.redStageThreeCells = 0;
        } else if (details.redStage === 2) {
          details.redStageThreeCells = redAutoCells + redTeleCells - details.redStageTwoCells - details.redStageOneCells;
        }

        details.redStage = 0;

        if (details.redStageThreeCells >= 20 && details.redPositionControl) {
          details.redStage = 3;
        } else if (details.redStageTwoCells >= 20 && details.redRotationControl) {
          details.redStage = 2;
        } else if (details.redStageOneCells >= 9 && redTeleCells > 0) {
          details.redStage = 1;
        } else {
          details.redStage = 0;
        }

        // if (redAutoCells + redTeleCells >= 9) {
        //   details.redStage = 1;
        // }
        // if (details.redStage === 1 && (redAutoCells + redTeleCells) >= details.redStageOneCells && details.redRotationControl) {
        //   details.redStage = 2;
        // }
        // if (details.redStage === 2 && (redAutoCells + redTeleCells) >= 49 && details.redPositionControl) {
        //   details.redStage = 3;
        // }
        // if (details.redStage === 1) {
        //   details.redStageOneCells = redAutoCells + redTeleCells;
        //   details.redStageTwoCells = 0;
        //   details.redStageThreeCells = 0;
        // }
        // if (details.redStage === 2) {
        //   details.redStageTwoCells = redTeleCells - details.redStageOneCells;
        //   details.redStageThreeCells = 0;
        // }
        // if (details.redStage === 3) {
        //   details.redStageThreeCells = redTeleCells - details.redStageTwoCells - details.redStageOneCells;
        // }

        const blueAutoCells: number = details.blueAutoInnerCells + details.blueAutoOuterCells + details.blueAutoBottomCells;
        const blueTeleCells: number = details.blueTeleInnerCells + details.blueTeleOuterCells + details.blueTeleBottomCells;

        if (details.blueStage === 0) {
          details.blueStageOneCells = blueAutoCells + blueTeleCells;
          details.blueStageTwoCells = 0;
          details.blueStageThreeCells = 0;
        } else if (details.blueStage === 1) {
          details.blueStageTwoCells = blueAutoCells + blueTeleCells - details.blueStageOneCells;
          details.blueStageThreeCells = 0;
        } else if (details.blueStage === 2) {
          details.blueStageThreeCells = blueAutoCells + blueTeleCells - details.blueStageTwoCells - details.blueStageOneCells;
        }

        details.blueStage = 0;

        if (details.blueStageThreeCells >= 20 && details.bluePositionControl) {
          details.blueStage = 3;
        } else if (details.blueStageTwoCells >= 20 && details.blueRotationControl) {
          details.blueStage = 2;
        } else if (details.blueStageOneCells >= 9 && blueTeleCells > 0) {
          details.blueStage = 1;
        } else {
          details.blueStage = 0;
        }

        // if (blueAutoCells + blueTeleCells >= 9) {
        //   details.blueStage = 1;
        // }
        // if (details.blueStage === 1 && (blueAutoCells + blueTeleCells) >= 29 && details.blueRotationControl) {
        //   details.blueStage = 2;
        // }
        // if (details.blueStage === 2 && (blueAutoCells + blueTeleCells) >= 49 && details.bluePositionControl) {
        //   details.blueStage = 3;
        // }
        // if (details.blueStage === 1) {
        //   details.blueStageOneCells = blueAutoCells + blueTeleCells;
        //   details.blueStageTwoCells = 0;
        //   details.blueStageThreeCells = 0;
        // }
        // if (details.blueStage === 2) {
        //   details.blueStageTwoCells = blueTeleCells - details.blueStageOneCells;
        //   details.blueStageThreeCells = 0;
        // }
        // if (details.blueStage === 3) {
        //   details.blueStageThreeCells = blueTeleCells - details.blueStageTwoCells - details.blueStageOneCells;
        // }
        break;
      case "22":
        // const details: RapidReactMatchDetails = this._match.matchDetails as RapidReactMatchDetails;

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