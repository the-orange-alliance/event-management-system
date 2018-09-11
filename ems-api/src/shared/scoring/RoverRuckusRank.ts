export default class RoverRuckusRank implements IPostableObject {
  private _rankKey: string;
  private _teamKey: number;
  private _rank: number;
  private _rankChange: number;
  private _rankingPoints: number;
  private _tiebreakerPoints: number;
  private _totalPoints: number;
  private _highScore: number;
  private _played: number;

  constructor() {
      this._rankKey = "";
      this._teamKey = 0;
      this._rank = 0;
      this._rankChange = 0;
      this._rankingPoints = 0;
      this._tiebreakerPoints = 0;
      this._totalPoints = 0;
      this._highScore = 0;
      this._played = 0;
  }

  public getKey(): string {
    return this.rankKey;
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

    /**
     * Getter rankKey
     * @return {string}
     */
	public get rankKey(): string {
		return this._rankKey;
	}

    /**
     * Getter teamKey
     * @return {number}
     */
	public get teamKey(): number {
		return this._teamKey;
	}

    /**
     * Getter rank
     * @return {number}
     */
	public get rank(): number {
		return this._rank;
	}

    /**
     * Getter rankChange
     * @return {number}
     */
	public get rankChange(): number {
		return this._rankChange;
	}

    /**
     * Getter rankingPoints
     * @return {number}
     */
	public get rankingPoints(): number {
		return this._rankingPoints;
	}

    /**
     * Getter tiebreakerPoints
     * @return {number}
     */
	public get tiebreakerPoints(): number {
		return this._tiebreakerPoints;
	}

    /**
     * Getter totalPoints
     * @return {number}
     */
	public get totalPoints(): number {
		return this._totalPoints;
	}

    /**
     * Getter highScore
     * @return {number}
     */
	public get highScore(): number {
		return this._highScore;
	}

    /**
     * Getter played
     * @return {number}
     */
	public get played(): number {
		return this._played;
	}

    /**
     * Setter rankKey
     * @param {string} value
     */
	public set rankKey(value: string) {
		this._rankKey = value;
	}

    /**
     * Setter teamKey
     * @param {number} value
     */
	public set teamKey(value: number) {
		this._teamKey = value;
	}

    /**
     * Setter rank
     * @param {number} value
     */
	public set rank(value: number) {
		this._rank = value;
	}

    /**
     * Setter rankChange
     * @param {number} value
     */
	public set rankChange(value: number) {
		this._rankChange = value;
	}

    /**
     * Setter rankingPoints
     * @param {number} value
     */
	public set rankingPoints(value: number) {
		this._rankingPoints = value;
	}

    /**
     * Setter tiebreakerPoints
     * @param {number} value
     */
	public set tiebreakerPoints(value: number) {
		this._tiebreakerPoints = value;
	}

    /**
     * Setter totalPoints
     * @param {number} value
     */
	public set totalPoints(value: number) {
		this._totalPoints = value;
	}

    /**
     * Setter highScore
     * @param {number} value
     */
	public set highScore(value: number) {
		this._highScore = value;
	}

    /**
     * Setter played
     * @param {number} value
     */
	public set played(value: number) {
		this._played = value;
	}
}