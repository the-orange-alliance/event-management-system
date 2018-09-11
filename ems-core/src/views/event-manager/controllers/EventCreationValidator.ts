import Event from "../../../shared/models/Event";
import EventConfiguration from "../../../shared/models/EventConfiguration";

class EventCreationValidator {
  private _event: Event;
  private _eventConfig: EventConfiguration;
  private _isValid: boolean;

  constructor(eventConfig: EventConfiguration, event: Event) {
    this._event = event;
    this._eventConfig = eventConfig;
    this._isValid = false;
  }

  public update(eventConfig: EventConfiguration, event?: Event): void {
    this._eventConfig = eventConfig;
    this._event = event;
    this.checkIfValid();
  }

  public isValidEventKey(): boolean {
    const key = this._event.eventKey;
    if (typeof this._event.season === "undefined" || typeof this._event.region === "undefined") {
      return false;
    }
    return typeof key === "string" && this.isSafe(key) && key.length > 8 + (this._event.region.regionKey.length) &&
      key.length < (6 + (this._event.region.regionKey.length) + 5);
  }

  public isValidEventType(): boolean {
    const type = this._event.eventType;
    return typeof type !== "undefined" && this.isSafe(type.toString()) && type.length > 0;
  }

  public isValidEventName(): boolean {
    const name = this._event.eventName;
    return typeof name === "string" && this.isSafe(name) && name.length > 10;
  }

  public isValidEventVenue(): boolean {
    const venue = this._event.venue;
    return typeof venue === "string" && this.isSafe(venue) && venue.length > 5;
  }

  public isValidCity(): boolean {
    const city = this._event.city;
    return typeof city === "string" && this.isSafe(city) && city.length > 0;
  }

  public isValidStateProv(): boolean {
    const stateProv = this._event.stateProv;
    return this.isSafe(stateProv);
  }

  public isValidCountry(): boolean {
    const country = this._event.country;
    return typeof country === "string" && this.isSafe(country) && country.length > 0;
  }

  public isValidWebsite(): boolean {
    const website = this._event.website;
    return this.isSafe(website);
  }

  public isValidFieldCount(): boolean {
    const fields = this._event.fieldCount;
    return typeof fields === "number" && this.isSafe(fields.toString()) && fields > 0;
  }

  public isValidTPA(): boolean {
    const tpa = this._eventConfig.teamsPerAlliance;
    return typeof tpa === "number" && this.isSafe(tpa.toString()) && tpa > 1 && tpa < 5;
  }

  public isValidPostQualTPA(): boolean {
    const tpa = this._eventConfig.postQualTeamsPerAlliance;
    return typeof tpa === "number" && this.isSafe(tpa.toString()) && tpa > 1 && tpa < 5;
  }

  public isValidAllianceCaptains(): boolean {
    const captains = this._eventConfig.allianceCaptains;
    if (this._eventConfig.postQualConfig === "finals") {
      return true;
    }
    return typeof captains === "number" && this.isSafe(captains.toString());
  }

  private checkIfValid(): void {
    this._isValid = this.isValidEventKey() && this.isValidEventName() && this.isValidEventVenue() && this.isValidCity()
      && this.isValidStateProv() && this.isValidCountry() && this.isValidWebsite() && this.isValidFieldCount()
      && this.isValidTPA() && this.isValidPostQualTPA() && this.isValidAllianceCaptains() && this.isValidEventType();
  }

  private isSafe(str: string): boolean {
    if (typeof str === "undefined") {
      return true;
    }
    if (str === null) {
      return true;
    }
    return str.match(/[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi) === null;
  }

  get isValid(): boolean {
    return this._isValid;
  }

}

export default EventCreationValidator;