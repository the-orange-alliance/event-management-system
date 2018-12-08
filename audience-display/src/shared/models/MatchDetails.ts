export default class MatchDetails implements IPostableObject {
  public _matchKey: string;
  public _matchDetailKey: string;

  constructor() {
    this._matchKey = "";
    this._matchDetailKey = "";
  }

  public toJSON(): object {
    return {
      match_key: this.matchKey,
      match_detail_key: this.matchDetailKey
    };
  }

  public fromJSON(json: any): MatchDetails {
    const details: MatchDetails = new MatchDetails();
    details.matchKey = json.match_key;
    details.matchDetailKey = json.match_detail_key;
    return details;
  }

  public getRedScore(minPen: number, majPen: number): number {
    return 0;
  }

  public getBlueScore(minPen: number, majPen: number): number {
    return 0;
  }

  get matchKey(): string {
    return this._matchKey;
  }

  set matchKey(value: string) {
    this._matchKey = value;
  }

  get matchDetailKey(): string {
    return this._matchDetailKey;
  }

  set matchDetailKey(value: string) {
    this._matchDetailKey = value;
  }
}