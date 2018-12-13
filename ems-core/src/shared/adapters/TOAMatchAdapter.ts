import Match from "../models/Match";
import TOAMatch from "../models/toa/TOAMatch";
import * as moment from "moment";

export default class TOAMatchAdapter {
  private _match: Match;

  constructor(match: Match) {
    this._match = match;
  }

  public get(): TOAMatch {
    const match: TOAMatch = new TOAMatch();
    const matchKey: string = this._match.matchKey;
    const keyParams: string[] = matchKey.split("-");
    match.matchKey = this._match.matchKey;
    match.eventKey = keyParams[0] + "-" + keyParams[1] + "-" + keyParams[2];
    match.tournamentLevel = this._match.tournamentLevel;
    match.scheduledTime =  moment(this._match.scheduledStartTime.format('YYYY/MM/DD HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
    match.matchName = this._match.matchName;
    match.playNumber = 1;
    match.fieldNumber = this._match.fieldNumber;
    match.redScore = this._match.redScore;
    match.blueScore = this._match.blueScore;
    // TODO - I'm not sure if this will work... Need to add in match details?!
    match.redPenalty = -1;
    match.bluePenalty = -1;
    match.redAutoScore = -1;
    match.blueAutoScore = -1;
    match.redTeleScore = -1;
    match.blueTeleScore = -1;
    match.redEndScore = -1;
    match.blueEndScore = -1;
    return match;
  }

}