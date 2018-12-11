export default class TOAConfig {
  private _eventKey: string;
  private _apiKey: string;
  private _enabled:  boolean;

  constructor() {
    this._eventKey = "";
    this._apiKey = "";
    this._enabled = false;
  }

  get eventKey(): string {
    return this._eventKey;
  }

  set eventKey(value: string) {
    this._eventKey = value;
  }

  get apiKey(): string {
    return this._apiKey;
  }

  set apiKey(value: string) {
    this._apiKey = value;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }
}