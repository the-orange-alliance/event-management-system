export default class TOAEventParticipant implements IPostableObject {
  private _eventParticipantKey: string;
  private _eventKey: string;
  private _teamKey: number;
  private _isActive: number;
  private _cardStatus: number;

  constructor() {
    this._eventParticipantKey = "";
    this._eventKey = "";
    this._teamKey = -1;
    this._isActive = 0;
    this._cardStatus = 0;
  }

  public toJSON(): object {
    return {
      event_participant_key: this.eventParticipantKey,
      event_key: this.eventKey,
      team_key: this.teamKey,
      is_active: this.isActive,
      card_status: this.cardStatus
    };
  }

  public fromJSON(json: any): TOAEventParticipant {
    const participant: TOAEventParticipant = new TOAEventParticipant();
    participant.eventParticipantKey = json.event_participant_key;
    participant.eventKey = json.event_key;
    participant.teamKey = json.team_key;
    participant.isActive = json.is_active;
    participant.cardStatus = json.card_status;
    return participant;
  }

  get eventParticipantKey(): string {
    return this._eventParticipantKey;
  }

  set eventParticipantKey(value: string) {
    this._eventParticipantKey = value;
  }

  get eventKey(): string {
    return this._eventKey;
  }

  set eventKey(value: string) {
    this._eventKey = value;
  }

  get teamKey(): number {
    return this._teamKey;
  }

  set teamKey(value: number) {
    this._teamKey = value;
  }

  get isActive(): number {
    return this._isActive;
  }

  set isActive(value: number) {
    this._isActive = value;
  }

  get cardStatus(): number {
    return this._cardStatus;
  }

  set cardStatus(value: number) {
    this._cardStatus = value;
  }
}