export default class TOAConfig implements IPostableObject {
  private _eventKey: string;
  private _apiKey: string;
  private _enabled:  boolean;

  constructor() {
    this._eventKey = "";
    this._apiKey = "";
    this._enabled = false;
  }

  public toJSON(): object {
    return {
      event_key: this.eventKey,
      api_key: this.apiKey
    };
  }

  public fromJSON(json: any): TOAConfig {
    const config: TOAConfig = new TOAConfig();
    config.eventKey = json.event_key || "";
    config.apiKey = json.api_key || "";
    if (config.eventKey.length > 0 && config.apiKey.length > 0) {
      config.enabled = true;
    }
    return config;
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