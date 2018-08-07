import Team from "./Team";

export default class MatchParticipant implements IPostableObject {
  private _matchParticipantKey: string;
  private _matchKey: string;
  private _teamKey: number;
  private _station: number;
  private _disqualified: boolean;
  private _cardStatus: number;
  private _surrogate: boolean;
  private _noShow: boolean;
  private _allianceKey: string;

  private _team: Team;

  constructor() {
    this._matchParticipantKey = "";
    this._matchKey = "";
    this._teamKey = -1;
    this._station = -1;
    this._disqualified = false;
    this._cardStatus = 0;
    this._surrogate = false;
    this._noShow = false;
    this._allianceKey = "";
  }

  public toJSON(): object {
    return {
      match_participant_key: this.matchParticipantKey,
      match_key: this.matchKey,
      team_key: this.teamKey,
      station: this.station,
      disqualified: this.disqualified ? 1 : 0,
      card_status: this.cardStatus,
      surrogate: this.surrogate ? 1 : 0,
      no_show: this.noShow ? 1 : 0,
      alliance_key: this._allianceKey
    };
  }

  public fromJSON(json: any): MatchParticipant {
    const participant: MatchParticipant = new MatchParticipant();
    participant.matchParticipantKey = json.match_participant_key;
    participant.matchKey = json.match_key;
    participant.teamKey = json.team_key;
    participant.station = json.station;
    participant.disqualified = json.disqualified === 1;
    participant.cardStatus = json.card_status;
    participant.surrogate = json.surrogate === 1;
    participant.noShow = json.no_show === 1;
    participant.allianceKey = json.alliance_key;
    return participant;
  }

  get matchParticipantKey(): string {
    return this._matchParticipantKey;
  }

  set matchParticipantKey(value: string) {
    this._matchParticipantKey = value;
  }

  get matchKey(): string {
    return this._matchKey;
  }

  set matchKey(value: string) {
    this._matchKey = value;
  }

  get teamKey(): number {
    return this._teamKey;
  }

  set teamKey(value: number) {
    this._teamKey = value;
  }

  get station(): number {
    return this._station;
  }

  set station(value: number) {
    this._station = value;
  }

  get disqualified(): boolean {
    return this._disqualified;
  }

  set disqualified(value: boolean) {
    this._disqualified = value;
  }

  get cardStatus(): number {
    return this._cardStatus;
  }

  set cardStatus(value: number) {
    this._cardStatus = value;
  }

  get surrogate(): boolean {
    return this._surrogate;
  }

  set surrogate(value: boolean) {
    this._surrogate = value;
  }

  get noShow(): boolean {
    return this._noShow;
  }

  set noShow(value: boolean) {
    this._noShow = value;
  }

  get team(): Team {
    return this._team;
  }

  set team(value: Team) {
    this._team = value;
  }

  get allianceKey(): string {
    return this._allianceKey;
  }

  set allianceKey(value: string) {
    this._allianceKey = value;
  }
}