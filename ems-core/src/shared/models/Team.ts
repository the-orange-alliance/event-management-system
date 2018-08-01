import {TeamIdentifier} from "../AppTypes";

export default class Team implements IPostableObject {
  private _teamKey: number;
  private _participantKey: string;
  private _teamNameShort: string;
  private _teamNameLong: string;
  private _robotName: string;
  private _hasCard: boolean;
  private _city: string;
  private _stateProv: string;
  private _country: string;
  private _countryCode: string;

  constructor() {
    this.teamKey = 0;
    this.teamNameShort = "";
    this.teamNameLong = "";
    this.robotName = "";
    this.city = "";
    this.stateProv = "";
    this.country = "";
    this.countryCode = "";
  }

  public getFromIdentifier(identifier: TeamIdentifier) {
    switch (identifier) {
      case "country":
        return this.country;
      case "team_key":
        return this.teamKey;
      case "team_name_short":
        return this.teamNameShort;
      default:
        return this.teamKey;
    }
  }

  public toJSON(): object {
    return {
      team_key: this.teamKey,
      event_participant_key: this.participantKey,
      team_name_short: this.teamNameShort,
      team_name_long: this.teamNameLong,
      robot_name: this.robotName,
      has_card: this.hasCard ? 1 : 0,
      city: this.city,
      state_prov: this.stateProv,
      country: this.country,
      country_code: this.countryCode
    };
  }

  public fromJSON(json: any): Team {
    const t: Team = new Team();
    t.teamKey = json.team_key;
    t.participantKey = json.event_participant_key;
    t.teamNameShort = json.team_name_short;
    t.teamNameLong = json.team_name_long;
    t.robotName = json.robot_name;
    t.hasCard = json.has_card;
    t.city = json.city;
    t.stateProv = json.state_prov;
    t.country = json.country;
    t.countryCode = json.country_code;
    return t;
  }

  get teamKey(): number {
    return this._teamKey;
  }

  set teamKey(value: number) {
    this._teamKey = value;
  }

  get participantKey(): string {
    return this._participantKey;
  }

  set participantKey(value: string) {
    this._participantKey = value;
  }

  get teamNameShort(): string {
    return this._teamNameShort;
  }

  set teamNameShort(value: string) {
    this._teamNameShort = value;
  }

  get teamNameLong(): string {
    return this._teamNameLong;
  }

  set teamNameLong(value: string) {
    this._teamNameLong = value;
  }

  get robotName(): string {
    return this._robotName;
  }

  set robotName(value: string) {
    this._robotName = value;
  }

  get hasCard(): boolean {
    return this._hasCard;
  }

  set hasCard(value: boolean) {
    this._hasCard = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

  get stateProv(): string {
    return this._stateProv;
  }

  set stateProv(value: string) {
    this._stateProv = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get location(): string {
    if (this.stateProv && this.stateProv.length > 0) {
      return this.city + ", " + this.stateProv + ", " + this.country;
    } else {
      return this.city + ", " + this.country;
    }
  }

  get countryCode(): string {
    return this._countryCode;
  }

  set countryCode(value: string) {
    if (value.length > 2) {
      value = value.substring(0, 2);
    }
    this._countryCode = value.toLowerCase();
  }
}