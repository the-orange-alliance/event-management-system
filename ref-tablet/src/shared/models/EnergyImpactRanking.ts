import Ranking from "./Ranking";

export default class EnergyImpactRanking extends Ranking {
  private _rankingPoints: number;
  private _totalPoints: number;
  private _coopertitionPoints: number;
  private _parkingPoints: number;

  constructor() {
    super();
    this._rankingPoints = 0;
    this._totalPoints = 0;
    this._coopertitionPoints = 0;
    this._parkingPoints = 0;
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

  public fromJSON(json: any): EnergyImpactRanking {
    const ranking: EnergyImpactRanking = new EnergyImpactRanking();
    ranking.rankKey = json.rank_key;
    ranking.teamKey = json.team_key;
    ranking.rank = json.rank;
    ranking.rankChange = json.rank_change;
    ranking.played = json.played;
    ranking.rankingPoints = json.ranking_points;
    ranking.totalPoints = json.total_points;
    ranking.coopertitionPoints = json.coopertition_points;
    ranking.parkingPoints = json.parking_points;
    return ranking;
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
}