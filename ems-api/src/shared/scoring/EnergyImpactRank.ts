export default class EnergyImpactRank implements IPostableObject {
  private _rankKey: string;
  private _teamKey: number;
  private _rank: number;
  private _rankChange: number;
  private _rankingPoints: number;
  private _totalPoints: number;
  private _coopertitionPoints: number;
  private _parkingPoints: number;
  private _played: number;

  constructor() {
    this._rankKey = "";
    this._teamKey = 0;
    this._rank = 0;
    this._rankChange = 0;
    this._rankingPoints = 0;
    this._totalPoints = 0;
    this._coopertitionPoints = 0;
    this._parkingPoints = 0;
    this._played = 0;
  }

  public getKey(): string {
    return this.rankKey;
  }
  
  public fromJSON(json: any): EnergyImpactRank {
    const rank: EnergyImpactRank = new EnergyImpactRank();
    rank.rankKey = json.rank_key;
    rank.teamKey = json.team_key;
    rank.rank = json.rank;
    rank.rankChange = json.rank_change;
    rank.played = json.played;
    rank.rankingPoints = json.ranking_points;
    rank.totalPoints = json.total_points;
    rank.coopertitionPoints = json.coopertition_points;
    rank.parkingPoints = json.parking_points;
    return rank;
  }

  public toJSON(): object {
    return {
      rank_key: this.rankKey,
      team_key: this.teamKey,
      rank: this.rank,
      rank_change: this.rankChange,
      played: this.played,
      ranking_points: this.rankingPoints,
      total_points: this.totalPoints,
      coopertition_points: this.coopertitionPoints,
      parking_points: this.parkingPoints
    };
  }

  get rankKey(): string {
    return this._rankKey;
  }

  set rankKey(value: string) {
    this._rankKey = value;
  }

  get teamKey(): number {
    return this._teamKey;
  }

  set teamKey(value: number) {
    this._teamKey = value;
  }

  get rank(): number {
    return this._rank;
  }

  set rank(value: number) {
    this._rank = value;
  }

  get rankChange(): number {
    return this._rankChange;
  }

  set rankChange(value: number) {
    this._rankChange = value;
  }

  get rankingPoints(): number {
    return this._rankingPoints;
  }

  set rankingPoints(value: number) {
    this._rankingPoints = value;
  }

  get totalPoints(): number {
    return this._totalPoints;
  }

  set totalPoints(value: number) {
    this._totalPoints = value;
  }

  get coopertitionPoints(): number {
    return this._coopertitionPoints;
  }

  set coopertitionPoints(value: number) {
    this._coopertitionPoints = value;
  }

  get parkingPoints(): number {
    return this._parkingPoints;
  }

  set parkingPoints(value: number) {
    this._parkingPoints = value;
  }

  get played(): number {
    return this._played;
  }

  set played(value: number) {
    this._played = value;
  }
}