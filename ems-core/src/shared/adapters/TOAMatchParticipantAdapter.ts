import MatchParticipant from "../models/MatchParticipant";
import TOAMatchParticipant from "../models/toa/TOAMatchParticipant";

export default class TOAMatchParticipantAdapter {
  private _participant: MatchParticipant;

  constructor(participant: MatchParticipant) {
    this._participant = participant;
  }

  public get(): TOAMatchParticipant {
    const participant: TOAMatchParticipant = new TOAMatchParticipant();
    const stationID: string = this._participant.station >= 20 ? ("B" + (this._participant.station - 19)) : ("R" + (this._participant.station - 9));
    participant.matchKey = this._participant.matchKey + "-1";
    participant.matchParticipantKey = this._participant.matchKey + "-1-" + stationID;
    participant.refStatus = this._participant.cardStatus || 0;
    participant.station = this._participant.station + 1;
    participant.teamKey = this._participant.teamKey + "";
    participant.stationStatus = this._participant.surrogate ? 0 : 1;
    return participant;
  }
}