import TOAEvent from "../models/toa/TOAEvent";
import Event from "../models/Event";
import {getFromSeasonKey} from "../data/Seasons";
import {getFromRegionKey} from "../data/Regions";

export default class EMSEventAdapter {
  private _toaEvent: TOAEvent;

  constructor(event: TOAEvent) {
    this._toaEvent = event;
  }

  public get(): Event {
    const event: Event = new Event();
    event.season = getFromSeasonKey(parseInt(this._toaEvent.seasonKey, 10));
    event.region = getFromRegionKey(this._toaEvent.regionKey);
    console.log(event);
    event.eventCode = this._toaEvent.eventCode;
    event.eventName = this._toaEvent.eventName;
    event.fieldCount = this._toaEvent.fieldCount;
    event.website = this._toaEvent.website;
    event.venue = this._toaEvent.venue;
    event.country = this._toaEvent.country;
    event.stateProv = this._toaEvent.stateProv;
    event.city = this._toaEvent.city;
    event.divisionName = this._toaEvent.divisionName;
    event.eventType = this.getEventType(this._toaEvent.eventTypeKey);
    return event;
  }

  private getEventType(toaEventType: string): string {
    switch (toaEventType.toLowerCase()) {
      case "qual":
        return "qual";
      case "lgmeet":
        return "league_meet";
      case "rcmp":
        return "region_cmp";
      case "sprrgnl":
        return "region_super";
      case "wrldcmp":
        return "cmp";
      case "offssn":
        return "off";
      default:
        return "qual";
    }
  }

}