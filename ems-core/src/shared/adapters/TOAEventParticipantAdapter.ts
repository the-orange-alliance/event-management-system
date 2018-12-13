import Team from "../models/Team";
import TOAEventParticipant from "../models/toa/TOAEventParticipant";

export default class TOAEventParticipantAdapter {
  private _team: Team;

  constructor(team: Team) {
    this._team = team;
  }
  
  public get(): TOAEventParticipant {
    const participant: TOAEventParticipant = new TOAEventParticipant();
    const participantKey: string = this._team.participantKey;
    const keyParams: string[] = participantKey.split("-");
    participant.eventParticipantKey = participantKey;
    participant.eventKey = keyParams[0] + "-" + keyParams[1] + "-" + keyParams[2];
    participant.isActive = 1;
    participant.teamKey = this._team.teamKey;
    participant.cardStatus = 0;
    return participant;
  }
}