export default class Season {

  private _seasonKey: number;
  private _seasonDescription: string;

  public static getFromEventKey(eventKey: string): Season {
    const parts = eventKey.split("-");
    return new Season(parseInt(parts[0], 10));
  }

  constructor(seasonKey: number, seasonDescription?: string) {
    this._seasonKey = seasonKey;
    this._seasonDescription = seasonDescription;
  }

  get seasonKey(): number {
    return this._seasonKey;
  }

  get seasonDesc(): string {
    return this._seasonDescription;
  }

}