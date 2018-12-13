import MatchDetails from "../models/MatchDetails";
import TOAMatchDetails from "../models/toa/TOAMatchDetails";
import Match from "../models/Match";

export default class TOAMatchDetailsAdapter {
  private _match: Match;
  private _matchDetails: MatchDetails;

  constructor(match: Match, details: MatchDetails) {
    this._match = match;
    this._matchDetails = details;
  }

  public get(): TOAMatchDetails {
    const details: TOAMatchDetails = new TOAMatchDetails();
    details.matchKey = this._matchDetails.matchKey;
    details.matchDetailKey = this._matchDetails.matchDetailKey;
    details.redMinPen = this._match.redMinPen;
    details.redMajPen = this._match.redMajPen;
    details.blueMinPen = this._match.blueMinPen;
    details.blueMajPen = this._match.blueMajPen;
    return details;
  }
}