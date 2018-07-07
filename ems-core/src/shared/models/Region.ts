export default class Region {

  private _regionKey: string;

  public static getFromEventKey(eventKey: string): Region {
    const parts = eventKey.split("-");
    return new Region(parts[0]);
  }

  constructor(region_key: string) {
    this._regionKey = region_key;
  }

  public get regionKey(): string {
    return this._regionKey;
  }

}