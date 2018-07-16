import Region from "./Region";
import Season from "./Season";

export default class Event implements IPostableObject {

  private _season: Season;
  private _region: Region;
  private _eventCode: string;
  private _eventName: string;
  private _venue: string;
  private _city: string;
  private _stateProv: string;
  private _country: string;
  private _fieldCount: number;
  private _website?: string;
  private _divisionName?: string;

  public toJSON(): object {
    return {
      season_key: this.season.seasonKey,
      region_key: this.region.regionKey,
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

  get season(): Season {
    return this._season;
  }

  set season(value: Season) {
    this._season = value;
  }

  get region(): Region {
    return this._region;
  }

  set region(value: Region) {
    this._region = value;
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
    if (typeof this.season === "undefined" || typeof this.region === "undefined") {
      return "";
    } else {
      return this.season.seasonKey + "-" + this.region.regionKey + "-" + (this.eventCode || "");
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