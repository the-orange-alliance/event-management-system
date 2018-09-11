import Team from "./Team";

export default class Ranking implements IPostableObject {
  private _rankKey: string;
  private _teamKey: number;
  private _rank: number;
  private _rankChange: number;
  private _played: number;

  // This item is separate, and not recorded directly in the 'Ranking' table.
  private _team: Team;

  constructor() {
    this._rankKey = "";
    this._teamKey = 0;
    this._rank = 0;
    this._rankChange = 0;
    this._played = 0;
  }

  public toJSON(): object {
    return {
      rank_key: this.rankKey,
      team_key: this.teamKey,
      rank: this.rank,
      rank_change: this.rankChange,
      played: this.played
    };
  }

  public fromJSON(json: any): Ranking {
    const ranking: Ranking = new Ranking();
    ranking.rankKey = json.rank_key;
    ranking.teamKey = json.team_key;
    ranking.rank = json.rank;
    ranking.rankChange = json.rank_change;
    ranking.played = json.played;
    return ranking;
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

  get played(): number {
    return this._played;
  }

  set played(value: number) {
    this._played = value;
  }

  get team(): Team {
    return this._team;
  }

  set team(value: Team) {
    this._team = value;
  }
}