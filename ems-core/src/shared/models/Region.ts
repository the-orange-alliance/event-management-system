export default class Region {

  private _regionKey: string;
  private _regionDescription: string;

  public static getFromEventKey(eventKey: string): Region {
    const parts = eventKey.split("-");
    return new Region(parts[1]);
  }

  constructor(regionKey: string, regionDescription?: string) {
    this._regionKey = regionKey;
    this._regionDescription = regionDescription;
  }

  public get regionKey(): string {
    return this._regionKey;
  }

  public get regionDesc(): string {
    return this._regionDescription;
  }

}