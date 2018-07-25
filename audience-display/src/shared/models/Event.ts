export default class Event implements IPostableObject {

  private _seasonKey: number;
  private _regionKey: string;
  private _eventCode: string;
  private _eventName: string;
  private _venue: string;
  private _city: string;
  private _stateProv: string;
  private _country: string;
  private _fieldCount: number;
  private _website: string;
  private _divisionName: string;

  public toJSON(): object {
    return {
      season_key: this.seasonKey,
      region_key: this.regionKey,
      event_key: this.eventKey,
      event_name: this.eventName,
      venue: this.venue,
      city: this.city,
      state_prov: this.stateProv,
      country: this.country,
      field_count: this.fieldCount,
      website: this.website,
      division_name: this.divisionName
    };
  }

  public fromJSON(json: any): Event {
    const e: Event = new Event();
    e.seasonKey = json.season_key;
    e.regionKey = json.region_key;
    e.eventCode = json.event_key.split("-")[2];
    e.eventName = json.event_name;
    e.venue = json.venue;
    e.city = json.city;
    e.stateProv = json.state_prov;
    e.country = json.country;
    e.fieldCount = json.field_count;
    e.website = json.website;
    e.divisionName = json.division_name;
    return e;
  }

  get seasonKey(): number {
    return this._seasonKey;
  }

  set seasonKey(value: number) {
    this._seasonKey = value;
  }

  get regionKey(): string {
    return this._regionKey;
  }

  set regionKey(value: string) {
    this._regionKey = value;
  }

  get eventCode(): string {
    return this._eventCode;
  }

  set eventCode(value: string) {
    if (value.length < 5) { // TODO - Magic number!
      this._eventCode = value;
    }
  }

  get eventKey(): string {
    if (typeof this.seasonKey === "undefined" || typeof this.regionKey === "undefined") {
      return "";
    } else {
      return this.seasonKey + "-" + this.regionKey + "-" + (this.eventCode || "");
    }
  }

  get eventName(): string {
    return this._eventName;
  }

  set eventName(value: string) {
    this._eventName = value;
  }

  get venue(): string {
    return this._venue;
  }

  set venue(value: string) {
    this._venue = value;
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

  get website(): string {
    return this._website;
  }

  set website(value: string) {
    this._website = value;
  }

  get fieldCount(): number {
    return this._fieldCount;
  }

  set fieldCount(value: number) {
    if (value < 1) {
      value = 1;
    }
    this._fieldCount = value;
  }

  get divisionName(): string {
    return this._divisionName;
  }

  set divisionName(value: string) {
    this._divisionName = value;
  }
}