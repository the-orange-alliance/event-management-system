export default class AllianceMember implements IPostableObject {
  private _allianceKey: string;
  private _allianceRank: number;
  private _teamKey: number;
  private _allianceNameShort: string;
  private _allianceNameLong: string;
  private _isCaptain: boolean;

  constructor() {
    this._allianceKey = "";
    this._allianceRank = 0;
    this._teamKey = 0;
    this._allianceNameShort = "";
    this._allianceNameLong = "";
    this._isCaptain = false;
  }

  public toJSON(): object {
    return {
      alliance_key: this.allianceKey,
      alliance_rank: this.allianceRank,
      team_key: this.teamKey,
      alliance_name_short: this.allianceNameShort,
      alliance_name_long: this.allianceNameLong,
      is_captain: this.isCaptain ? 1 : 0
    };
  }

  public fromJSON(json: any): AllianceMember {
    const member: AllianceMember = new AllianceMember();
    member.allianceKey = json.alliance_key;
    member.allianceRank = json.alliance_rank;
    member.teamKey = json.team_key;
    member.allianceNameShort = json.alliance_name_short;
    member.allianceNameLong = json.alliance_name_long;
    member.isCaptain = json.is_captain === 1;
    return member;
  }

  get allianceKey(): string {
    return this._allianceKey;
  }

  set allianceKey(value: string) {
    this._allianceKey = value;
  }

  get allianceRank(): number {
    return this._allianceRank;
  }

  set allianceRank(value: number) {
    this._allianceRank = value;
  }

  get teamKey(): number {
    return this._teamKey;
  }

  set teamKey(value: number) {
    this._teamKey = value;
  }

  get allianceNameShort(): string {
    return this._allianceNameShort;
  }

  set allianceNameShort(value: string) {
    this._allianceNameShort = value;
  }

  get allianceNameLong(): string {
    return this._allianceNameLong;
  }

  set allianceNameLong(value: string) {
    this._allianceNameLong = value;
  }

  get isCaptain(): boolean {
    return this._isCaptain;
  }

  set isCaptain(value: boolean) {
    this._isCaptain = value;
  }
}