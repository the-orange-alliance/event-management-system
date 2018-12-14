import Ranking from "../models/Ranking";
import TOARanking from "../models/toa/TOARanking";
import RoverRuckusRank from "../models/RoverRuckusRank";

export default class TOARankingAdapter {
  private _ranking: Ranking;

  constructor(ranking: Ranking) {
    this._ranking = ranking;
  }

  public static getRankingFromSeasonKey(seasonKey: number | string): Ranking {
    const key: number = parseInt(seasonKey.toString(), 10);
    switch (key) {
      case 1819:
        return new RoverRuckusRank();
      default:
        return new Ranking();
    }
  }

  public get(): TOARanking {
    const ranking: TOARanking = new TOARanking();
    const rankKey: string = this._ranking.rankKey;
    const keyParams: string[] = rankKey.split("-");
    ranking.eventKey = keyParams[0] + "-" + keyParams[1] + "-" + keyParams[2];
    ranking.rankKey = this._ranking.rankKey;
    ranking.teamKey = this._ranking.teamKey;
    ranking.rank = this._ranking.rank;
    ranking.rankChange = this._ranking.rankChange || 0;
    ranking.played = this._ranking.played;
    ranking.wins = this._ranking.wins;
    ranking.losses = this._ranking.losses;
    ranking.ties = this._ranking.ties;
    this.assignData(ranking);
    return ranking;
  }

  private assignData(ranking: TOARanking) {
    if (this._ranking instanceof RoverRuckusRank) {
      ranking.disqualified = 0;
      ranking.highestQualScore = this._ranking.highScore;
      ranking.rankingPoints = this._ranking.rankingPoints;
      ranking.qualifyingPoints = 0;
      ranking.tieBreakerPoints = this._ranking.tiebreakerPoints;
      // Actually have no idea what to do for these values.
    }
  }
}