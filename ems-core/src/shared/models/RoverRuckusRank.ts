import Ranking from "./Ranking";

export default class RoverRuckusRank extends Ranking {
  private _rankingPoints: number;
  private _tiebreakerPoints: number;
  private _totalPoints: number;
  private _highScore: number;

  constructor() {
    super();
    this._rankingPoints = 0;
    this._tiebreakerPoints = 0;
    this._totalPoints = 0;
    this._highScore = 0;
  }

  public fromJSON(json: any): RoverRuckusRank {
    const rank: RoverRuckusRank = new RoverRuckusRank();
    rank.rankKey = json.rank_key;
    rank.teamKey = json.team_key;
    rank.rank = json.rank;
    rank.rankChange = json.rank_change;
    rank.played = json.played;
    rank.rankingPoints = json.ranking_points;
    rank.tiebreakerPoints = json.tiebreaker_points;
    rank.totalPoints = json.total_points;
    rank.highScore = json.highest_score;
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
      tiebreaker_points: this.tiebreakerPoints,
      total_points: this.totalPoints,
      highest_score: this.highScore
    };
  }

  get rankingPoints(): number {
    return this._rankingPoints;
  }

  set rankingPoints(value: number) {
    this._rankingPoints = value;
  }

  get tiebreakerPoints(): number {
    return this._tiebreakerPoints;
  }

  set tiebreakerPoints(value: number) {
    this._tiebreakerPoints = value;
  }

  get totalPoints(): number {
    return this._totalPoints;
  }

  set totalPoints(value: number) {
    this._totalPoints = value;
  }

  get highScore(): number {
    return this._highScore;
  }

  set highScore(value: number) {
    this._highScore = value;
  }
}