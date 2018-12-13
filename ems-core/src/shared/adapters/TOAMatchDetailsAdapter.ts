import MatchDetails from "../models/MatchDetails";
import TOAMatchDetails from "../models/toa/TOAMatchDetails";
import Match from "../models/Match";
import TOARoverRuckusDetails from "../models/toa/TOARoverRuckusDetails";
import RoverRuckusMatchDetails from "../models/RoverRuckusMatchDetails";

export default class TOAMatchDetailsAdapter {
  private _match: Match;
  private _matchDetails: MatchDetails;

  constructor(match: Match, details: MatchDetails) {
    this._match = match;
    this._matchDetails = details;
  }

  public get(): TOAMatchDetails {
    const details: TOAMatchDetails = this.getSeasonDetails();
    details.matchKey = this._match.matchKey + "-1";
    details.matchDetailKey = this._match.matchKey + "-1-DTL";
    details.redMinPen = this._match.redMinPen;
    details.redMajPen = this._match.redMajPen;
    details.blueMinPen = this._match.blueMinPen;
    details.blueMajPen = this._match.blueMajPen;
    this.assignDetails(details);
    return details;
  }

  private getSeasonDetails(): TOAMatchDetails {
    if (this._matchDetails instanceof RoverRuckusMatchDetails) {
      return new TOARoverRuckusDetails();
    } else {
      return new TOAMatchDetails();
    }
  }

  private assignDetails(details: TOAMatchDetails) {
    if (this._matchDetails instanceof RoverRuckusMatchDetails) {
      // TODO - REMOVE DUMMY VALUE
      (details as TOARoverRuckusDetails).redAutoLand = this._matchDetails.redEndRobotTwoStatus;
    }
  }
}