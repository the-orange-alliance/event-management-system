import MatchParticipant from "../models/MatchParticipant";
import TOAMatchParticipant from "../models/toa/TOAMatchParticipant";

export default class TOAMatchParticipantAdapter {
  private _participant: MatchParticipant;

  constructor(participant: MatchParticipant) {
    this._participant = participant;
  }

  public get(): TOAMatchParticipant {
    const participant: TOAMatchParticipant = new TOAMatchParticipant();
    participant.matchKey = this._participant.matchKey;
    participant.matchParticipantKey = this._participant.matchParticipantKey;
    participant.refStatus = this._participant.cardStatus;
    participant.station = this._participant.station;
    participant.teamKey = this._participant.teamKey + "";
    participant.stationStatus = this._participant.disqualified ? 1 : 0;
    return participant;
  }
}