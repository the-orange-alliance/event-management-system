import EnergyImpactDetails from "./EnergyImpactDetails";

export type MatchDetails = EnergyImpactDetails;

export default class BasicMatch implements IPostableObject {
  private _redScore: number;
  private _redMinPen: number;
  private _redMajPen: number;
  private _redDetails: MatchDetails;
  private _blueScore: number;
  private _blueMinPen: number;
  private _blueMajPen: number;
  private _blueDetails: MatchDetails;
  private _cardStatuses: number[];
  private _shared: any;

  constructor() {
    this._redScore = 0;
    this._redMinPen = 0;
    this._redMajPen = 0;
    this._redDetails = new EnergyImpactDetails();
    this._blueScore = 0;
    this._blueMinPen = 0;
    this._blueMajPen = 0;
    this._blueDetails = new EnergyImpactDetails();
    this._cardStatuses = [0, 0, 0, 0, 0, 0];
    this._shared = {};
  }

  public toJSON(): object {
    return {
      red: {
        score: this.redScore,
        minPen: this.redMinPen,
        majPen: this.redMajPen,
        details: this.redDetails.toJSON()
      },
      blue: {
        score: this.blueScore,
        minPen: this.blueMinPen,
        majPen: this.blueMajPen,
        details: this.blueDetails.toJSON()
      },
      cardStatus: this.cardStatuses,
      shared: this.shared
    };
  }

  public fromJSON(json: any): BasicMatch {
    const match: BasicMatch = new BasicMatch();
    match.redScore = json.red.score;
    match.redMinPen = json.red.minPen;
    match.redMajPen = json.red.majPen;
    match.redDetails = new EnergyImpactDetails().fromJSON(json.red.details);
    match.blueScore = json.blue.score;
    match.blueMinPen = json.blue.minPen;
    match.blueMajPen = json.blue.majPen;
    match.blueDetails = new EnergyImpactDetails().fromJSON(json.blue.details);
    match.cardStatuses = json.cardStatus;
    match.shared = json.shared;
    return match;
  }

  get redScore(): number {
    return this._redScore;
  }

  set redScore(value: number) {
    this._redScore = value;
  }

  get redMinPen(): number {
    return this._redMinPen;
  }

  set redMinPen(value: number) {
    this._redMinPen = value;
  }

  get redMajPen(): number {
    return this._redMajPen;
  }

  set redMajPen(value: number) {
    this._redMajPen = value;
  }

  get redDetails(): MatchDetails {
    return this._redDetails;
  }

  set redDetails(value: MatchDetails) {
    this._redDetails = value;
  }

  get blueScore(): number {
    return this._blueScore;
  }

  set blueScore(value: number) {
    this._blueScore = value;
  }

  get blueMinPen(): number {
    return this._blueMinPen;
  }

  set blueMinPen(value: number) {
    this._blueMinPen = value;
  }

  get blueMajPen(): number {
    return this._blueMajPen;
  }

  set blueMajPen(value: number) {
    this._blueMajPen = value;
  }

  get blueDetails(): MatchDetails {
    return this._blueDetails;
  }

  set blueDetails(value: MatchDetails) {
    this._blueDetails = value;
  }

  get cardStatuses(): number[] {
    return this._cardStatuses;
  }

  set cardStatuses(value: number[]) {
    this._cardStatuses = value;
  }

  get shared(): any {
    return this._shared;
  }

  set shared(value: any) {
    this._shared = value;
  }
}